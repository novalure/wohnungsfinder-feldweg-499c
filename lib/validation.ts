import { z } from 'zod'

export const BUYER_TYPE_LABELS = {
  eigennutzer: 'Eigennutzer',
  anleger: 'Anleger',
} as const

export const leadSchema = z.object({
  anrede: z.string().optional(),
  name: z.string().min(2, 'Bitte geben Sie Ihren Namen ein.'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein.'),
  telefon: z.string().min(5, 'Bitte geben Sie Ihre Telefonnummer ein.'),
  interesse: z.array(z.string()).min(1, 'Bitte wählen Sie mindestens ein Interesse.'),
  kaeuferart: z.enum(['eigennutzer', 'anleger'], {
    required_error: 'Bitte wählen Sie Eigennutzer oder Anleger.',
    invalid_type_error: 'Bitte wählen Sie Eigennutzer oder Anleger.',
  }),
  nachricht: z.string().optional(),
  datenschutz: z
    .boolean()
    .refine((value) => value, 'Bitte bestätigen Sie die Kenntnisnahme der Datenschutzerklärung.'),
  website: z.string().max(0, 'Spam-Schutz ausgelöst.').optional().or(z.literal('')),
  recaptchaToken: z.string().optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
