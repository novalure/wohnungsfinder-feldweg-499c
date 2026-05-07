import type { LeadInput } from './validation'

let resendClient: unknown

async function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendClient) {
    const { Resend } = await import('resend')
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient as { emails: { send: (payload: unknown) => Promise<unknown> } }
}

export async function sendLeadMail(lead: LeadInput) {
  const to = process.env.LEAD_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const from = process.env.RESEND_FROM_EMAIL || 'Website <onboarding@resend.dev>'
  const resend = await getResend()

  if (!resend || !to) {
    console.info('Lead dry-run:', lead)
    return { dryRun: true }
  }

  return resend.emails.send({
    from,
    to,
    subject: `Neue Anfrage: ${lead.interesse.join(', ')}`,
    reply_to: lead.email,
    text: [
      `Name: ${lead.name}`,
      `Anrede: ${lead.anrede || '-'}`,
      `E-Mail: ${lead.email}`,
      `Telefon: ${lead.telefon || '-'}`,
      `Interesse: ${lead.interesse.join(', ')}`,
      '',
      lead.nachricht || '-',
    ].join('\n'),
  })
}
