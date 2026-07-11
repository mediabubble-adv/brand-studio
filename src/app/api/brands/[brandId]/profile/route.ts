import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(
  req: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const body = await req.json()
    const { brandId } = params

    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .update(body)
      .eq('brand_id', brandId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, error: null })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .select('*, brands(name, slug, industry)')
      .eq('brand_id', params.brandId)
      .single()

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 404 })
    }

    return NextResponse.json({ data, error: null })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
