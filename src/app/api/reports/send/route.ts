import { NextRequest, NextResponse } from 'next/server'
import { sendReportEmail } from '@/lib/mail/resend'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { reportId } = await req.json()

    if (!reportId) {
      return NextResponse.json({ data: null, error: 'reportId is required' }, { status: 400 })
    }

    const { data: report, error: reportError } = await supabaseAdmin
      .from('reports')
      .select('*, brands(name)')
      .eq('id', reportId)
      .single()

    if (reportError || !report) {
      return NextResponse.json({ data: null, error: 'Report not found' }, { status: 404 })
    }

    const brandName = (report.brands as any)?.name || 'Brand'
    const reportLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reports/view/${report.shareable_token}`

    if (!report.client_email) {
      return NextResponse.json({ data: null, error: 'Client email is not configured for this report' }, { status: 400 })
    }

    // Send email via Resend
    const result = await sendReportEmail(report.client_email, brandName, reportLink)

    // Update report status
    await supabaseAdmin
      .from('reports')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', reportId)

    return NextResponse.json({ data: result, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
