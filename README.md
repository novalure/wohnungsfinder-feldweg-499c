# Premium-Wohnprojekt am Achensee

Next.js-One-Pager für ein Premium-Wohnbauprojekt mit 6 Eigentumswohnungen am Achensee. Die Seite ist auf qualifizierte Anfragen, Exposé-Downloads und klare Kontaktwege optimiert.

## Setup

```bash
pnpm install
pnpm dev
```

Die lokale Website läuft danach üblicherweise unter `http://localhost:3000`.

Falls `pnpm` nicht global verfügbar ist:

```bash
npx pnpm@9.15.4 install
npx pnpm@9.15.4 dev
```

## Inhalte pflegen

Zentrale Projekt- und Kontaktdaten liegen in:

- `config/project.json`
- `config/wohnungen.json`

Alle `{{ ... }}`-Platzhalter können dort ersetzt werden. Projektname, Adresse, Kontakt, Downloads, Bauträger, Tracking-IDs und rechtliche Firmendaten werden daraus in der Website ausgespielt.

## Wohnungs-Status pflegen

Die produktiven Wohnungsdaten der integrierten Wohnungsfinder-Komponente liegen in `components/sections/data.ts`. Der Status wird pro Wohnung im Feld `status` gepflegt.

Erlaubte Werte:

- `verfuegbar`
- `reserviert`
- `verkauft`

Bei `reserviert` zeigt die Detailansicht automatisch den Hinweis „Hohe Nachfrage — sichern Sie sich Ihre Wohnung jetzt.“ Die Hotspot-Logik, Akkordeon-Mechanik, Lightbox und Tastaturbedienung bleiben unverändert.

## Bilder ergänzen

Alle benötigten Bild-Slots stehen in `IMAGES_REQUIRED.md`. Platzhalterbilder sind im Projekt angelegt, sollten aber vor Live-Gang durch finale Visualisierungen, Fotos und Portraits ersetzt werden.

## PDFs

Die Download-Pfade werden in `config/project.json` gepflegt:

- Exposé
- Preisliste
- Bau- und Ausstattungsbeschreibung

Die Dateien müssen unter `public/pdf/` mit den dort hinterlegten Dateinamen abgelegt werden.

## Mail-Versand

Der Lead-Endpunkt liegt unter `app/api/lead/route.ts`. Ohne Mail-Konfiguration läuft der Versand als Dry-Run in den Server-Logs.

Empfohlene ENV-Variablen:

```bash
RESEND_API_KEY=...
RESEND_FROM_EMAIL="Projekt <anfrage@example.at>"
LEAD_TO_EMAIL="{{EMAIL_KONTAKT}}"
RECAPTCHA_SECRET_KEY=...
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
NEXT_PUBLIC_CONTACT_EMAIL="{{EMAIL_KONTAKT}}"
```

## Tracking

GA4-ID und Meta-Pixel-ID werden in `config/project.json` gepflegt. Marketing-Skripte werden erst nach Cookie-Zustimmung geladen.

Implementierte Events:

- `view_section`
- `pdf_download`
- `phone_click`
- `email_click`
- `wohnung_detail_open`
- `wohnung_anfrage`
- `lead_submit`

## Deployment auf Vercel

1. Repository mit Vercel verbinden.
2. Framework Preset: Next.js.
3. ENV-Variablen in Vercel setzen.
4. Build Command: `pnpm build`.
5. Output wird automatisch von Next.js verwaltet.

## Rechtliches

`app/datenschutz/page.tsx` und `app/impressum/page.tsx` enthalten österreichische Standard-Templates mit Platzhaltern. Vor Live-Gang müssen diese Texte juristisch geprüft und auf die tatsächlich eingesetzten Dienste angepasst werden.
