import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date().toISOString()

    // Fetch approved scheduled posts past their publish date
    const { data: posts, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('publish_at', now)

    if (fetchError) {
      return NextResponse.json({ data: null, error: fetchError.message }, { status: 500 })
    }

    for (const post of posts || []) {
      // Simulation of Meta Graph API request
      // fetch(`https://graph.facebook.com/v19.0/.../photos?url=${post.final_image_url}&caption=${post.caption_en}`)

      // Mark as published
      await supabaseAdmin
        .from('posts')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', post.id)
    }

    return NextResponse.json({ data: { processed: posts?.length || 0 }, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
