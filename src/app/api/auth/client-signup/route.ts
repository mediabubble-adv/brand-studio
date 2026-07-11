import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ data: null, error: 'Email and password required' }, { status: 400 })
    }

    const domain = email.split('@')[1]

    // Check if domain is allowlisted
    const { data: domainRow, error: domainError } = await supabaseAdmin
      .from('client_domains')
      .select('brand_id')
      .eq('domain', domain)
      .single()

    if (domainError || !domainRow) {
      return NextResponse.json({ data: null, error: 'Email domain not authorized' }, { status: 403 })
    }

    // Create user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ data: null, error: authError?.message ?? 'Signup failed' }, { status: 400 })
    }

    // Assign client_member role for the allowlisted brand
    const { error: membershipError } = await supabaseAdmin
      .from('brand_memberships')
      .insert({
        user_id: authData.user.id,
        brand_id: domainRow.brand_id,
        role: 'client_member',
      })

    if (membershipError) {
      return NextResponse.json({ data: null, error: 'Membership assignment failed' }, { status: 500 })
    }

    return NextResponse.json({ data: { userId: authData.user.id }, error: null })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
