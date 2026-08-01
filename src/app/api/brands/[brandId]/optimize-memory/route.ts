import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface FeedbackJoinRow {
  rating: number
  posts: {
    caption_en: string | null
    caption_ar: string | null
  } | null
}

export async function POST(
  req: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params

    // Fetch all feedback with post captions for this brand
    const { data, error } = await supabaseAdmin
      .from('post_feedback')
      .select('rating, posts:posts(caption_en, caption_ar, brand_id)')
      .eq('posts.brand_id', brandId)

    if (error || !data) {
      return NextResponse.json({ data: null, error: error?.message ?? 'No feedback data found' }, { status: 404 })
    }

    const rows = data as unknown as FeedbackJoinRow[]

    const goodCaptions = rows
      .filter(r => r.rating >= 4)
      .map(r => r.posts?.caption_en || r.posts?.caption_ar)
      .filter(Boolean)

    const badCaptions = rows
      .filter(r => r.rating <= 2)
      .map(r => r.posts?.caption_en || r.posts?.caption_ar)
      .filter(Boolean)

    if (goodCaptions.length === 0 && badCaptions.length === 0) {
      return NextResponse.json({ data: null, error: 'Insufficient ratings data' }, { status: 400 })
    }

    // Invoke Gemini to extract successful and avoid keyword arrays
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'dummy_key')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
      Analyze these successful social media captions (rated 4-5 stars):
      ${JSON.stringify(goodCaptions)}
      
      And these unsuccessful captions (rated 1-2 stars):
      ${JSON.stringify(badCaptions)}
      
      Return a JSON object containing two string arrays of short keywords/topics/style terms:
      {
        "successful_keywords": ["up to 5 positive descriptors/topics to repeat"],
        "avoid_keywords": ["up to 5 negative descriptors/topics to avoid"]
      }
      Return ONLY JSON. No markdown.
    `

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    const learnings = JSON.parse(clean)

    // Upsert into brand_memories
    const { data: upsertData, error: upsertError } = await supabaseAdmin
      .from('brand_memories')
      .upsert({
        brand_id: brandId,
        successful_keywords: learnings.successful_keywords || [],
        avoid_keywords: learnings.avoid_keywords || [],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'brand_id' })
      .select()
      .single()

    if (upsertError) {
      return NextResponse.json({ data: null, error: upsertError.message }, { status: 500 })
    }

    return NextResponse.json({ data: upsertData, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
