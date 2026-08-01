import { NextRequest, NextResponse } from 'next/server'
import { generatePostContent } from '@/lib/ai/generate-content'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { brandId, briefTopic } = await req.json()

    if (!brandId || !briefTopic) {
      return NextResponse.json({ data: null, error: 'brandId and briefTopic are required' }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('brand_profiles')
      .select('languages, dialects, tone_keywords')
      .eq('brand_id', brandId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ data: null, error: 'Brand profile not found' }, { status: 404 })
    }

    // Fetch Brand AI Memory
    const { data: memory } = await supabaseAdmin
      .from('brand_memories')
      .select('successful_keywords, avoid_keywords')
      .eq('brand_id', brandId)
      .single()

    const content = await generatePostContent(
      briefTopic,
      profile,
      memory || { successful_keywords: [], avoid_keywords: [] }
    )
    return NextResponse.json({ data: content, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
