import { BUYER_TYPE_LABELS, type LeadInput } from './validation'

let resendClient: unknown

const DEFAULT_MAILBOX = 'hello@novalure.eu'
const DEFAULT_FROM = `Vallis Achen Residenzen <${DEFAULT_MAILBOX}>`

type ResendSendResult = {
  data?: { id?: string }
  error?: { message?: string; name?: string } | string | null
}

async function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.')
  }

  if (!resendClient) {
    const { Resend } = await import('resend')
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }

  return resendClient as { emails: { send: (payload: unknown) => Promise<ResendSendResult> } }
}

export async function sendLeadMail(lead: LeadInput) {
  const leadTo = process.env.LEAD_TO_EMAIL || DEFAULT_MAILBOX
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM
  const replyTo = process.env.CONTACT_REPLY_TO_EMAIL || DEFAULT_MAILBOX
  const resend = await getResend()
  const interesse = lead.interesse.join(', ')
  const kaeuferart = BUYER_TYPE_LABELS[lead.kaeuferart]

  const internalText = [
    'Neue Anfrage ueber die Website Vallis Achen Residenzen',
    '',
    `Name: ${lead.name}`,
    `Anrede: ${lead.anrede || '-'}`,
    `E-Mail: ${lead.email}`,
    `Telefon: ${lead.telefon || '-'}`,
    `Interesse: ${interesse}`,
    `Kaeuferart: ${kaeuferart}`,
    '',
    'Nachricht:',
    lead.nachricht || '-',
  ].join('\n')

  const confirmationText = [
    `Guten Tag${lead.anrede ? ` ${lead.anrede}` : ''} ${lead.name},`,
    '',
    'vielen Dank fuer Ihre Anfrage zu den Vallis Achen Residenzen.',
    `Wir haben Ihr Interesse an ${interesse} erhalten und melden uns zeitnah mit den passenden Unterlagen und naechsten Schritten.`,
    `Ihre Auswahl: ${kaeuferart}.`,
    '',
    'Diese E-Mail ist eine automatische Eingangsbestätigung.',
    '',
    'Freundliche Gruesse',
    'NovaLure',
    DEFAULT_MAILBOX,
  ].join('\n')

  const internalResult = await sendEmail(resend, {
    from,
    to: leadTo,
    subject: `Neue Anfrage: ${interesse}`,
    reply_to: lead.email,
    text: internalText,
    html: renderInternalHtml(lead, interesse, kaeuferart),
  })

  const confirmationResult = await sendEmail(resend, {
    from,
    to: lead.email,
    subject: 'Ihre Anfrage ist eingegangen - Vallis Achen Residenzen',
    reply_to: replyTo,
    text: confirmationText,
    html: renderConfirmationHtml(lead, interesse, kaeuferart),
  })

  return {
    internalMessageId: internalResult.data?.id,
    confirmationMessageId: confirmationResult.data?.id,
  }
}

async function sendEmail(
  resend: { emails: { send: (payload: unknown) => Promise<ResendSendResult> } },
  payload: unknown,
) {
  const result = await resend.emails.send(payload)

  if (result.error) {
    throw new Error(formatResendError(result.error))
  }

  return result
}

function formatResendError(error: NonNullable<ResendSendResult['error']>) {
  if (typeof error === 'string') return error
  return [error.name, error.message].filter(Boolean).join(': ') || 'Resend email send failed.'
}

function renderInternalHtml(lead: LeadInput, interesse: string, kaeuferart: string) {
  return renderHtmlShell(
    'Neue Website-Anfrage',
    'Eine neue Anfrage wurde ueber das Kontaktformular gesendet.',
    [
      ['Name', lead.name],
      ['Anrede', lead.anrede || '-'],
      ['E-Mail', lead.email],
      ['Telefon', lead.telefon || '-'],
      ['Interesse', interesse],
      ['Käuferart', kaeuferart],
      ['Nachricht', lead.nachricht || '-'],
    ],
  )
}

function renderConfirmationHtml(lead: LeadInput, interesse: string, kaeuferart: string) {
  return renderHtmlShell(
    'Ihre Anfrage ist eingegangen',
    `Guten Tag ${escapeHtml(lead.name)}, vielen Dank fuer Ihre Anfrage zu den Vallis Achen Residenzen. Wir haben Ihr Interesse an ${escapeHtml(interesse)} erhalten und melden uns zeitnah mit den passenden Unterlagen und naechsten Schritten.`,
    [
      ['Interesse', interesse],
      ['Käuferart', kaeuferart],
      ['Kontakt', DEFAULT_MAILBOX],
    ],
    'Diese E-Mail ist eine automatische Eingangsbestätigung.',
  )
}

function renderHtmlShell(
  title: string,
  intro: string,
  rows: Array<[string, string]>,
  footer = '',
) {
  return `
    <div style="margin:0;background:#f7f4ee;padding:32px 0;font-family:Arial,sans-serif;color:#1f2a2e;">
      <div style="margin:0 auto;max-width:640px;background:#ffffff;border:1px solid #ded7ca;border-radius:8px;padding:32px;">
        <p style="margin:0 0 10px;color:#8a6b22;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Vallis Achen Residenzen</p>
        <h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:32px;line-height:1.1;color:#1f2a2e;">${escapeHtml(title)}</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4f5a5f;">${intro}</p>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${rows
              .map(
                ([label, value]) => `
                  <tr>
                    <td style="border-top:1px solid #ece6dc;padding:12px 10px 12px 0;width:150px;color:#6b7377;font-size:13px;font-weight:700;">${escapeHtml(label)}</td>
                    <td style="border-top:1px solid #ece6dc;padding:12px 0;font-size:15px;line-height:1.5;color:#1f2a2e;">${escapeHtml(value).replace(/\n/g, '<br />')}</td>
                  </tr>
                `,
              )
              .join('')}
          </tbody>
        </table>
        ${footer ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b7377;">${escapeHtml(footer)}</p>` : ''}
      </div>
    </div>
  `
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
