import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { rating, comments } = await req.json()
    const { postId } = params

    if (!rating) {
      return NextResponse.json({ data: null, error: 'rating is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('post_feedback')
      .upsert({
        post_id: postId,
        rating,
        comments,
      }, { onConflict: 'post_id' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
