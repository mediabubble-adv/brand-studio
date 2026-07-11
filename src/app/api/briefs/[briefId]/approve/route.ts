import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: NextRequest,
  { params }: { params: { briefId: string } }
) {
  try {
    const { action, feedback } = await req.json()
    const { briefId } = params

    if (!action) {
      return NextResponse.json({ data: null, error: 'action is required' }, { status: 400 })
    }

    const statusMap: Record<string, string> = {
      review: 'brief_reviewed',
      approve_design: 'design_approved',
      schedule: 'scheduled',
    }

    const nextStatus = statusMap[action]

    if (!nextStatus) {
      return NextResponse.json({ data: null, error: 'Invalid workflow action' }, { status: 400 })
    }

    const { data: brief, error: briefError } = await supabaseAdmin
      .from('briefs')
      .update({ status: nextStatus })
      .eq('id', briefId)
      .select()
      .single()

    if (briefError) {
      return NextResponse.json({ data: null, error: briefError.message }, { status: 500 })
    }

    return NextResponse.json({ data: brief, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
