import { NextResponse } from 'next/server'
import { sendLeadMail } from '@/lib/mailer'
import { leadSchema } from '@/lib/validation'

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const params = new URLSearchParams({
    secret,
    response: token,
  })

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })
  const result = (await response.json()) as { success?: boolean; score?: number }
  return Boolean(result.success && (result.score ?? 0) >= 0.5)
}

export async function POST(request: Request) {
  const json = await request.json()
  const parsed = leadSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const recaptchaOk = await verifyRecaptcha(parsed.data.recaptchaToken)
  if (!recaptchaOk) {
    return NextResponse.json(
      { ok: false, message: 'Die Sicherheitsprüfung ist fehlgeschlagen.' },
      { status: 400 },
    )
  }

  await sendLeadMail(parsed.data)
  return NextResponse.json({ ok: true })
}
