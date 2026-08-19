# SEO-Status

Stand: 2026-08-18

## Umgesetzt

- Zentrale Site-URL über `lib/site.ts` mit `NEXT_PUBLIC_SITE_URL`-Fallback.
- Sitemap auf indexierbare URLs beschränkt: Startseite und verfügbare/reservierte Wohnungsdetailseiten.
- Stabiles `lastModified` über `CONTENT_UPDATED_AT`.
- Rechtsseiten mit `noindex, follow`.
- Verkaufte Wohnungsdetailseiten mit `noindex, follow`.
- JSON-LD in `lib/jsonld.ts` konsolidiert.
- `llms.txt` als optionale AI-Agent-Hilfsdatei mit `X-Robots-Tag: noindex`.
- Web-App-Manifest ergänzt.
- Wohnungsfinder-Tabelle um `scope="col"` ergänzt.

## Bewusst nicht umgesetzt

- Keine neue `/wohnungen`-Übersichtsseite, weil sie eine neue sichtbare Seite wäre.
- Keine sichtbaren FAQ- oder SEO-Textabschnitte.
- Keine Domainumstellung und kein Deployment.

## Offene Livegang-Schritte

- `NEXT_PUBLIC_SITE_URL` nach Domainumstellung in Vercel setzen.
- Google Search Console und Bing Webmaster verifizieren.
- Sitemap einreichen.
- Rich Results Test und URL Inspection für Startseite und verfügbare Detailseiten durchführen.
- Testanfragen in ChatGPT Search, Perplexity und klassischen Suchmaschinen prüfen.

## QA

- `npm run build`: erfolgreich.
- `npm run lint`: erfolgreich, keine ESLint-Warnungen.
- Lokale Endpunktprüfung mit `npm run start`:
  - `/`: 200, genau eine H1, ein valides JSON-LD-`@graph`.
  - `/wohnungen/wohnung-2`: 200, `index, follow`, genau eine H1, valides JSON-LD mit `RealEstateListing` und `BreadcrumbList`.
  - `/wohnungen/wohnung-4`: 200, `index, follow`, genau eine H1, valides JSON-LD mit `RealEstateListing` und `BreadcrumbList`.
  - `/wohnungen/wohnung-1`: 200, `noindex, follow`, genau eine H1, valides JSON-LD mit `SoldOut`-Offer ohne Preis.
  - `/wohnungen`: 404, bewusst nicht umgesetzt und nicht in der Sitemap.
  - `/robots.txt`: 200, `text/plain`.
  - `/sitemap.xml`: 200, `application/xml`, enthält nur Startseite und verfügbare Wohnungsdetailseiten.
  - `/llms.txt`: 200, `text/plain; charset=utf-8`, `X-Robots-Tag: noindex`.
  - `/manifest.webmanifest`: 200, `application/manifest+json`.
  - `/favicon.ico`: 200, `image/x-icon`.
  - `/icon.png`: 200, `image/png`.
  - `/apple-icon.png`: 200, `image/png`.
- Hardcode-Check: `wohnungsfinder-feldweg-499c.vercel.app` nur in `lib/site.ts`, `.env.example` und Dokumentation/Promptdateien.
