import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_resend_key')

export async function sendReportEmail(
  toEmail: string,
  brandName: string,
  reportLink: string
) {
  const { data, error } = await resend.emails.send({
    from: 'MediaBubble Reports <reports@mediabubble.co>',
    to: [toEmail],
    subject: `Monthly Performance Report: ${brandName}`,
    html: `
      <h2>Hello,</h2>
      <p>Your performance report for this month is ready for your review.</p>
      <p><a href="${reportLink}" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">View Live Dashboard Report</a></p>
      <br/>
      <p>Thank you,</p>
      <p>MediaBubble Team</p>
    `,
  })

  if (error) {
    throw new Error(`Resend dispatch failed: ${error.message}`)
  }

  return data
}
