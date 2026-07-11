import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { publishToFacebook, publishToInstagram } from '@/lib/publish/meta'
import { refreshGoogleAccessToken, uploadGoogleAdsAsset } from '@/lib/publish/google-ads'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface JoinedPost {
  id: string
  brand_id: string
  final_image_url: string | null
  caption_en: string | null
  caption_ar: string | null
  format: string
  status: string
  publish_at: string | null
  brand_profiles: {
    facebook_page_id: string | null
    facebook_access_token: string | null
    instagram_business_id: string | null
    google_ads_customer_id: string | null
    google_refresh_token: string | null
  } | null
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date().toISOString()

    // Fetch approved scheduled posts past their publish date with joined brand profile
    const { data, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('*, brand_profiles:brand_profiles(*)')
      .eq('status', 'scheduled')
      .lte('publish_at', now)

    if (fetchError) {
      return NextResponse.json({ data: null, error: fetchError.message }, { status: 500 })
    }

    const posts = (data || []) as unknown as JoinedPost[]

    for (const post of posts) {
      const profile = post.brand_profiles
      if (!profile) continue

      const caption = post.caption_en || post.caption_ar || ''
      const imageUrl = post.final_image_url

      if (!imageUrl) continue

      // 1. Publish to Facebook Page if configured
      if (profile.facebook_page_id && profile.facebook_access_token) {
        const fbRes = await publishToFacebook(
          imageUrl,
          caption,
          profile.facebook_page_id,
          profile.facebook_access_token
        )

        await supabaseAdmin.from('publish_logs').insert({
          post_id: post.id,
          platform: 'facebook',
          status: 'error' in fbRes ? 'failed' : 'success',
          error_message: 'error' in fbRes ? fbRes.error : null,
          payload: fbRes,
        })
      }

      // 2. Publish to Instagram Business if configured
      if (profile.instagram_business_id && profile.facebook_access_token) {
        const igRes = await publishToInstagram(
          imageUrl,
          caption,
          profile.instagram_business_id,
          profile.facebook_access_token
        )

        await supabaseAdmin.from('publish_logs').insert({
          post_id: post.id,
          platform: 'instagram',
          status: 'error' in igRes ? 'failed' : 'success',
          error_message: 'error' in igRes ? igRes.error : null,
          payload: igRes,
        })
      }

      // 3. Upload to Google Ads if configured and image format matches ad size
      if (
        profile.google_ads_customer_id &&
        profile.google_refresh_token &&
        post.format.startsWith('google_')
      ) {
        try {
          const accessToken = await refreshGoogleAccessToken(profile.google_refresh_token)
          const googleRes = await uploadGoogleAdsAsset(
            imageUrl,
            `Asset-${post.id}`,
            profile.google_ads_customer_id,
            accessToken
          )

          await supabaseAdmin.from('publish_logs').insert({
            post_id: post.id,
            platform: 'google_ads',
            status: 'error' in googleRes ? 'failed' : 'success',
            error_message: 'error' in googleRes ? googleRes.error : null,
            payload: googleRes,
          })
        } catch (tokenErr: unknown) {
          await supabaseAdmin.from('publish_logs').insert({
            post_id: post.id,
            platform: 'google_ads',
            status: 'failed',
            error_message: tokenErr instanceof Error ? tokenErr.message : 'Google Ads token refresh failed',
          })
        }
      }

      // Mark post as published
      await supabaseAdmin
        .from('posts')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', post.id)
    }

    return NextResponse.json({ data: { processed: posts.length }, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
