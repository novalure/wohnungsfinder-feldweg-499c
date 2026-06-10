# Accessibility Audit - Vallis Achen Residenzen

Datum: 2026-06-10  
Scope: Next.js Landingpage mit Wohnungsfinder, Navigation, Galerie, Lagekarte,
Kontaktformular, Consent/Footer. Phase 1 ist reine Analyse; es wurden keine
Produktivdateien geaendert.

## Gesamtbewertung

Status: **nicht WCAG 2.1 AA / EN 301 549 ready**.

Die wichtigsten Blocker sind nicht ersetzte Template-Platzhalter im live
gerenderten Titel/PDF-Link und in Wohnungsdetails, unvollstaendige
Tastatur-/Modal-Regeln fuer Lightbox und Exit-Intent-Popup, Formularmeldungen
ohne programmatische Fehler-/Statusverknuepfung sowie fehlende Skip-/Anchor-
Fokuslogik. Zusaetzlich verhindern aktuelle Projektfehler eine belastbare
CI-Pruefung: `lint`, `typecheck` und `build` schlagen im aktuellen Worktree fehl.

Hinweis zur Audit-Situation: Der Worktree war bereits vor dem Audit dirty und
hat sich waehrend der Analyse weiter veraendert. Die Befunde unten referenzieren
den aktuellen Stand der Dateien zum Audit-Zeitpunkt. Gerenderte HTML-Pruefung
wurde lokal fuer die Startseite begonnen; Browser-/axe-/Lighthouse-Pruefung war
wegen fehlender lokaler Tools bzw. Sandbox-Problemen nicht vollstaendig
ausfuehrbar.

## Tooling-Nachweis

| Check | Ergebnis | Nachweis / Kommentar |
| --- | --- | --- |
| `npm run lint` | Fail | `app/datenschutz/page.tsx:118` unescaped quotes (`react/no-unescaped-entities`). |
| `npm run typecheck` | Fail | `components/CookieBanner.tsx:349` kollidiert mit `lib/consent.ts:23` bei `Window.dataLayer`. |
| `npm run build` | Fail | Missing route file: `app/cookie-richtlinie/page.tsx` ist im Worktree geloescht, aber wird weiterhin referenziert. |
| axe-core | Nicht ausfuehrbar | Kein `axe`/`@axe-core/playwright` im aktuellen `node_modules/.bin`; keine Projekt-Task vorhanden. |
| Lighthouse | Nicht ausfuehrbar | Kein lokales Lighthouse-Paket/Script vorhanden. |
| eslint-plugin-jsx-a11y | Teilweise | Indirekt ueber `next/core-web-vitals` im Lockfile vorhanden, aber kein explizites Projekt-Setup. |
| Gerendertes HTML | Teilweise | Lokaler Fetch bestaetigte `{{ORT_KURZ}}` im `<title>` und `{{PROJEKTNAME}}` im PDF-Link. Danach wurde der Dev-Server unresponsive. |

## Quick Wins (<= 15 Min)

| ID | WCAG | Schweregrad | Datei:Zeile | Komponente | Befund | Konkreter Fix |
| --- | --- | --- | --- | --- | --- | --- |
| QW-01 | 2.4.2 Page Titled | Blocker | `config/project.json:7`, `app/layout.tsx:28` | Metadata / Seitentitel | `project.ortKurz` ist `{{ORT_KURZ}}`; der live gerenderte Titel enthaelt den Platzhalter. | `ortKurz` mit realem Ort befuellen, z. B. `Achenkirch`, und vor Build per Placeholder-Check blockieren. |
| QW-02 | 2.4.4 Link Purpose, 3.2.4 Consistent Identification | Hoch | `config/project.json:41-43`, `components/sections/Hero.tsx:56`, `components/sections/Projekt.tsx:73`, `components/sections/Ausstattung.tsx:125`, `components/ConversionLinks.tsx:28` | PDF-/Exposé-Links | PDF-Hrefs enthalten `{{PROJEKTNAME}}`; Nutzer und Screenreader erhalten Links auf technische Platzhalter bzw. 404-Dateien. | PDF-Dateien und Config auf reale, sprechende Dateinamen umstellen; optional Link nur rendern, wenn Datei existiert. |
| QW-03 | 1.3.1 Info and Relationships, 2.4.6 Headings and Labels | Mittel | `config/project.json:11`, `components/sections/Wohnungsfinder.tsx:336`, `components/sections/Wohnungsfinder.tsx:356` | Wohnungsdetails | HWB wird als `{{HWB_WERT}} kWh/m²a` in Details ausgegeben. | Wert aus `lib/legal-config.ts:42` oder realem Energieausweis uebernehmen; Platzhalter im Detailpanel vermeiden. |
| QW-04 | 1.4.3 Contrast Minimum | Mittel | `styles/globals.css:70-75` | Eyebrow Labels | Gold `#B89968` auf `#FAF7F2`/weiss hat nur ca. 2.52:1/2.69:1; kleine uppercase Labels sind unter AA. | Accent-2 fuer Text minimal abdunkeln, z. B. Richtung `#7A5A10`, oder Eyebrow-Text mit `accent`/`ink` setzen und Gold dekorativ behalten. |
| QW-05 | 1.4.11 Non-text Contrast, 2.4.7 Focus Visible | Mittel | `components/sections/Wohnungsfinder.tsx:138`, `components/sections/Wohnungsfinder.tsx:207`, `components/consent/CookieConsent.tsx:177`, `components/layout/SiteFooter.tsx:69` | Fokus-Indikatoren | Mehrere Fokus-Ringe nutzen `accent2`; auf hellen Flaechen liegt der Ring unter 3:1. | Fuer `focus-visible` auf hellen Flaechen `accent` (`#2F4A3A`, ca. 9:1) oder dunklere Ringfarbe verwenden. |
| QW-06 | 2.4.1 Bypass Blocks | Hoch | `components/OnePager.tsx:55-57`, `components/Navigation.tsx:60` | Layout / Navigation | Kein "Skip to content"-Link vor der Hauptnavigation. | Direkt vor `<Navigation />` einen sichtbar fokussierbaren Skip-Link zu `#main-content` ergaenzen; `<main id="main-content" tabIndex={-1}>`. |
| QW-07 | 2.4.3 Focus Order, 2.4.7 Focus Visible | Mittel | `styles/globals.css:22-26`, `components/Navigation.tsx:79`, `components/Navigation.tsx:117`, `components/OnePager.tsx:23-30` | Sticky Navigation / Anchors | Ankerziele erhalten keinen Fokus; Header kann Zielbereich visuell ueberdecken. | `scroll-margin-top` fuer `section[id]` setzen und bei programmatischem Scroll das Ziel kurz fokussieren. |
| QW-08 | 3.3.2 Labels or Instructions | Mittel | `components/sections/Kontakt.tsx:168-178`, `components/sections/Kontakt.tsx:272` | Kontaktformular | Pflichtfelder werden visuell nur mit `*` markiert; keine textliche Pflichtfeld-Erklaerung. | Vor dem Formular "Pflichtfelder sind mit 'Pflichtfeld' gekennzeichnet" ergaenzen; sichtbares Label z. B. `Vor- und Nachname (Pflichtfeld)`. |
| QW-09 | 4.1.3 Status Messages, 3.3.1 Error Identification | Hoch | `components/sections/Kontakt.tsx:84-89`, `components/sections/Kontakt.tsx:148-156`, `components/sections/Kontakt.tsx:214-242` | Kontaktformular | Submit-Fehler werden geworfen, Erfolg/Fehler nicht per `aria-live` angekuendigt; Fehlertexte sind nicht per `aria-describedby` mit Feldern verbunden. | Formularstatus-State statt Throw, `role="alert"` fuer Fehler, `role="status"`/`aria-live="polite"` fuer Erfolg, IDs an Fehlertexte und `aria-describedby` an Inputs. |
| QW-10 | 2.5.3 Label in Name | Niedrig | `components/sections/ProjectGallery.tsx:79` | Galerie-Links | Accessible Name nutzt ASCII `vergroessern`; sichtbare Sprache ist deutsch mit Umlaut-Konvention. | `aria-label={`${item.alt} vergrößern`}` oder sichtbaren Text/Tooltip konsistent verwenden. |
| QW-11 | 1.1.1 Non-text Content | Niedrig | `components/sections/Lage.tsx:54` | Lage-Teaserbilder | Alt-Texte sind nur Kategorienamen ("Natur & Aktiv") und duplizieren benachbarte Heading-Texte. | Wenn dekorativ: `alt=""`; wenn informativ: konkrete Bildbeschreibung statt Kategoriename. |
| QW-12 | 2.4.4 Link Purpose | Mittel | `components/ConversionLinks.tsx:28-33` | Section CTA | Linktext "Exposé" ist ohne Kontext knapp, besonders bei wiederholten CTAs. | Linktext/Name auf "Exposé als PDF herunterladen" erweitern. |

## Strukturell

| ID | WCAG | Schweregrad | Datei:Zeile | Komponente | Befund | Konkreter Fix |
| --- | --- | --- | --- | --- | --- | --- |
| ST-01 | 4.1.2 Name, Role, Value; 1.3.1 Info and Relationships | Hoch | `components/sections/Wohnungsfinder.tsx:195-206` | Wohnungstabelle | `<tr>` wird mit `role="button"`, `tabIndex`, `aria-expanded` und Keyhandler als Button zweckentfremdet. Das ist fuer Tabellen-/Screenreader-Navigation fragil. | In der Aktionsspalte einen echten `<button aria-expanded aria-controls>` rendern; Zeile semantisch Tabelle lassen. Optional ganze Zeile per CSS klickbar machen, aber Fokus auf Button. |
| ST-02 | 4.1.2 Name, Role, Value | Mittel | `components/sections/Wohnungsfinder.tsx:250-254` | Wohnungsdetails Accordion | Panel hat `id`, aber kein `role="region"` und kein `aria-labelledby`; Steuerung sitzt aktuell auf `<tr>`. | Detailpanel als `region` mit `aria-labelledby` auf den jeweiligen Button/Top-Header verbinden. |
| ST-03 | 2.1.1 Keyboard, 4.1.2 Name Role Value | Mittel | `components/sections/Wohnungsfinder.tsx:127-132` | Front-Skizze Hotspots | Hotspots sind echte Buttons, aber verkaufte Wohnungen sind `disabled` und dadurch nicht fokussierbar; Status "verkauft" ist nur fuer Maus/visuell im Plan nachvollziehbar. | Verkauft-Buttons fokussierbar lassen, mit `aria-disabled="true"` und Click-Guard; Accessible Name z. B. "Top 1, verkauft, nicht verfügbar". |
| ST-04 | 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, 4.1.2 | Hoch | `components/sections/Wohnungsfinder.tsx:62-74`, `components/sections/Wohnungsfinder.tsx:433-460` | Grundriss-Lightbox | Dialog setzt `aria-modal` und Esc, aber kein initialer Fokus, keine Fokusfalle, keine Fokus-Rueckgabe an Ausloeser. Hintergrund bleibt im Tab-Fokus erreichbar. | Beim Oeffnen Close-Button fokussieren, Tab/Shift+Tab innerhalb halten, beim Schliessen Fokus zum Ausloeser zurueckgeben. |
| ST-05 | 2.1.2 No Keyboard Trap, 4.1.2 | Hoch | `components/ExitIntent.tsx:48-98` | Exit-Intent-Popup | Sichtbares Desktop-Popup hat kein `role="dialog"`, kein `aria-modal`, kein Label, keine Fokusfalle, kein Esc, keine Fokus-Rueckgabe. | Entweder barrierefrei als Modal implementieren oder entfernen; mit `role="dialog" aria-modal="true" aria-labelledby`, Fokusmanagement und Esc. |
| ST-06 | 3.3.2 Labels, 2.5.3 Label in Name | Hoch | `components/ExitIntent.tsx:76-82` | Exit-Intent E-Mail | E-Mail-Feld hat nur Placeholder, kein Label. | Sichtbares `<label>` oder `aria-label`, besser echtes Label "E-Mail-Adresse". |
| ST-07 | 4.1.2 Name, Role, Value | Mittel | `components/consent/CookieConsent.tsx:216-224` | Consent Accordion | Kategorien-Button hat `aria-expanded`, aber kein `aria-controls`; Panel hat keine feste ID/Region. | Pro Kategorie `id`, `aria-controls`, `role="region"`, `aria-labelledby` ergaenzen. |
| ST-08 | 1.1.1 Non-text Content, 2.1.1 Keyboard | Mittel | `components/sections/LageMap.tsx:55`, `components/sections/LageMap.tsx:73-75` | Lagekarte | Interaktive Karte hat nur `aria-label`; Textalternative mit Entfernungen ist nicht programmatisch als Alternative verknuepft. Noscript-Bild hilft nicht bei aktiver JS-Nutzung. | Karte mit `aria-describedby` auf sichtbare Entfernungs-/Adressliste verbinden oder statische Textalternative direkt neben der Karte referenzieren. |
| ST-09 | 1.2.x Time-based Media, 2.2.2 Pause Stop Hide | Mittel | `components/sections/ProjectGallery.tsx:58-66` | Galerie-Video | Autoplay-Loop-Video hat keine Steuerung/Pause und keine ausdrueckliche Textalternative. | Bei dekorativem Video `aria-hidden`, Poster/Alt-Alternative; bei informativem Video Pause/Play-Button und Kurzbeschreibung. |
| ST-10 | 1.3.1 Info and Relationships | Mittel | `components/sections/Wohnungsfinder.tsx:347-360`, `components/sections/Wohnungsfinder.tsx:357` | Detail-Datenliste | In einem `<dl>` liegt ein trennendes `<div>` zwischen `dt/dd`-Paaren; das stoert Semantik. | Trennung ausserhalb des `dl` oder als CSS Border auf Gruppen; `dt/dd` direkt in semantische Gruppen. |
| ST-11 | 2.1.1 Keyboard, 2.5.8 Target Size | Mittel | `components/sections/Kontakt.tsx:117-142`, `components/layout/SiteFooter.tsx:40-47` | Telefon-/Mail-Links | Touch-Zielgroessen sind im Kontaktbereich wahrscheinlich ok durch Line-Height/Gaps, im Footer nur Textlinks ohne Mindesthoehe. | Links als `inline-flex min-h-6 items-center` oder groessere Padding/Line-Height setzen; Icons `aria-hidden`. |
| ST-12 | 1.4.10 Reflow | Mittel | `app/cookie-richtlinie/page.tsx` (geloescht), `app/datenschutz/page.tsx:115`, `components/layout/SiteFooter.tsx:64` | Cookie-Route | Route wird weiter verlinkt, Datei ist im aktuellen Worktree geloescht; Build bricht. | Route wiederherstellen oder Links entfernen/umleiten. Fuer Barrierefreiheitserklaerung ebenfalls stabile Route einplanen. |

## Inhaltlich / Redaktionell

| ID | WCAG | Schweregrad | Datei:Zeile | Komponente | Befund | Konkreter Fix |
| --- | --- | --- | --- | --- | --- | --- |
| IN-01 | 2.4.2, 2.4.4 | Blocker | `config/project.json:7-13`, `config/project.json:36-48`, `config/wohnungen.json:8-73` | Projekt-/Wohnungsdaten | Zahlreiche Template-Platzhalter sind noch im Repository. Einige sind live sichtbar, andere koennen spaeter in SEO/Downloads/Details auftauchen. | Vor Go-Live alle `{{...}}` ersetzen oder per Build-Script blockieren. |
| IN-02 | 2.4.2, 2.4.4 | Hoch | `lib/legal-config.ts:1`, `app/layout.tsx:27`, `app/sitemap.ts:4` | Canonical / Sitemap / OG | Layout nutzt aktuell Vercel-Preview-Domain; Sitemap zeigt weiterhin `https://www.example.at`. | Finale Live-Domain zentral in `SITE_URL` setzen und `sitemap.ts` daraus ableiten. |
| IN-03 | EN 301 549 / EAA Transparenz | Mittel | neue Route empfohlen | Barrierefreiheitserklaerung | Keine Accessibility-Statement-Route vorhanden. | `app/barrierefreiheit/page.tsx` mit Erklaerung, Kontaktweg und Stand der Vereinbarkeit anlegen. |
| IN-04 | 1.1.1 Non-text Content | Niedrig | `components/sections/Hero.tsx:20`, `components/sections/Hero.tsx:28` | Hero-Bilder | Alt-Texte beschreiben Stimmungen, aber bei reinen dekorativen Hintergrundbildern wuerden sie Screenreader-Nutzern zusaetzliche, doppelte Inhalte liefern. | Entscheiden: informativ lassen und spezifischer beschreiben, oder dekorativ `alt=""` falls H1/Copy alles Wesentliche transportieren. |
| IN-05 | 3.1.2 Language of Parts | Niedrig | `components/sections/Intro.tsx:38-39` | Lateinischer Begriff | "Vallis Achen" ist fremdsprachig/historisch, aber ohne `lang="la"`. | Bei laengeren fremdsprachigen Passagen `lang` setzen; fuer diesen kurzen Eigennamen eher redaktionell optional. |

## Template-Platzhalter

Im initial gerenderten Output bestaetigt:

| Platzhalter | Sichtbarkeit | Quelle | Auswirkung |
| --- | --- | --- | --- |
| `{{ORT_KURZ}}` | `<title>` | `config/project.json:7`, `app/layout.tsx:28` | Screenreader-Seitentitel und SEO fehlerhaft. |
| `{{PROJEKTNAME}}` | PDF-Hrefs | `config/project.json:41-43`, genutzt in Hero/Projekt/Ausstattung/CTAs | Links fuehren auf technische Platzhalterdateien. |

Interaktionsabhaengig bzw. aus Source ableitbar:

| Platzhalter | Quelle | Erwartetes Risiko |
| --- | --- | --- |
| `{{HWB_WERT}}` | `config/project.json:11`, `components/sections/Wohnungsfinder.tsx:356` | Wird in geoeffneten Wohnungsdetails ausgegeben. |
| `{{WFL_VON}}`, `{{WFL_BIS}}`, `{{ZI_VON}}`, `{{ZI_BIS}}`, `{{FERTIGSTELLUNG_QUARTAL}}`, `{{PREIS_AB}}` | `config/project.json:9-13` | Derzeit nicht in den gelesenen Komponenten gefunden, bleibt Go-Live-Risiko. |
| `{{BAUTRAEGER_NAME}}`, `{{BAUTRAEGER_URL}}` | `config/project.json:36-38` | Kann bei spaeterer Nutzung sichtbar/falsch werden. |
| `{{GA4_ID}}`, `{{HOTJAR_ID}}`, `{{META_PIXEL_ID}}` | `config/project.json:46-48` | Consent-Code guardet konfigurierte Werte; trotzdem Placeholder-Inventar vor Go-Live bereinigen. |
| `{{HIMMELSRICHTUNG}}` | `config/wohnungen.json:8-73` | Datei scheint aktuell nicht fuer `WOHNUNGEN` genutzt, bleibt Datenqualitaetsrisiko. |

## Wohnungsfinder: Tastatur-Nachweis

Nachweisstatus: **nicht bestanden / nicht vollstaendig verifizierbar**.

Abgeleiteter Tab-Durchlauf aus dem Code:

1. Header-Links und Hero-CTAs sind als Links/Buttons erreichbar.
2. In der Front-Skizze sind Top-2 bis Top-6 als Buttons fokussierbar; Top 1 ist wegen `disabled` nicht fokussierbar.
3. In der Tabelle sind Top-2 bis Top-6 ueber fokussierbare `<tr role="button">` erreichbar; Enter/Space oeffnet Details.
4. Im Detailpanel sind "Top X anfragen", "Schliessen" und "Grundriss vergroessern" per Tab erreichbar.
5. Die Grundriss-Lightbox schliesst mit Esc und Close-Button, haelt den Fokus aber nicht im Dialog und gibt ihn nicht an den Ausloeser zurueck.

Damit ist die Kernfunktion teilweise ohne Maus bedienbar, aber nicht AA-stabil:
verkaufte Einheiten sind im Plan nicht per Fokus wahrnehmbar, die Tabellenzeile
ist kein echtes Bedienelement, und die Lightbox verletzt Modal-Fokusregeln.

## WCAG 2.1 AA Checkliste

| Kriterium | Status | Nachweis / Fail-Referenz |
| --- | --- | --- |
| 1.1.1 Nicht-Text-Inhalte | Fail | Lage-Alt dupliziert Heading (`components/sections/Lage.tsx:54`); Karte ohne verknuepfte Textalternative (`components/sections/LageMap.tsx:55`). |
| 1.2.x Zeitbasierte Medien | Fail | Autoplay-Loop-Video ohne Pause/Textalternative (`components/sections/ProjectGallery.tsx:58-66`). |
| 1.3.1 Info & Beziehungen | Fail | Tabellenzeilen als Buttons (`components/sections/Wohnungsfinder.tsx:195-206`), Formularfehler nicht verknuepft (`components/sections/Kontakt.tsx:214-242`). |
| 1.3.2 Sinnvolle Reihenfolge | Pass mit Restrisiko | DOM-Hauptfluss ist logisch; modale Overlays brauchen Fokusmanagement. |
| 1.3.4 Ausrichtung | Pass | Keine Orientierungssperre gefunden. |
| 1.3.5 Eingabezweck | Pass | Name/E-Mail/Tel nutzen `autocomplete` (`components/sections/Kontakt.tsx:169-178`). |
| 1.4.1 Nicht nur Farbe | Pass mit Restrisiko | Status-Badges enthalten Text (`components/sections/Wohnungsfinder.tsx:315-321`); Plan-Hotspots koennen verkaufte Einheit per Fokus nicht wahrnehmbar machen. |
| 1.4.3 Kontrast Minimum | Fail | `accent2` auf hellen Hintergruenden ca. 2.52:1/2.69:1 (`styles/globals.css:70-75`). |
| 1.4.4 Textgroesse aenderbar | Nicht voll verifiziert | Keine Browser-Zoom-Pruefung moeglich; Klassen nutzen ueberwiegend rem/Tailwind. |
| 1.4.5 Text statt Textgrafik | Pass mit Restrisiko | Kein Fliesstext als Bild gefunden; Logos sind Bilder mit Alt. |
| 1.4.10 Reflow | Nicht voll verifiziert | 320px-Browserpruefung nicht abgeschlossen; Tabellenlayout `table-fixed` mit sehr kleinen Texten bleibt pruefpflichtig. |
| 1.4.11 Kontrast Nicht-Text | Fail | `accent2` Fokus-Ringe unter 3:1 auf hellen Flaechen. |
| 1.4.12 Textabstand | Nicht voll verifiziert | Keine Browserpruefung mit erhoehten Textabstaenden moeglich. |
| 1.4.13 Inhalt bei Hover/Fokus | Pass mit Restrisiko | Keine Tooltips gefunden; Galerie/Lightbox-Fokus gesondert fixen. |
| 2.1.1 Tastatur | Fail | Lightbox/Exit-Intent nicht voll modal-tastaturbedienbar; Tabellenzeilen statt Buttons. |
| 2.1.2 Keine Tastaturfalle | Fail | Lightbox/Exit-Intent ohne Fokusfalle/Rueckgabe (`Wohnungsfinder.tsx:433-460`, `ExitIntent.tsx:48-98`). |
| 2.4.1 Bloecke umgehen | Fail | Kein Skip-Link (`components/OnePager.tsx:55-57`). |
| 2.4.2 Seitentitel | Fail | `{{ORT_KURZ}}` im Titel (`config/project.json:7`, `app/layout.tsx:28`). |
| 2.4.3 Fokus-Reihenfolge | Fail | Modale Fokuslogik fehlt; Ankerziele werden nicht fokussiert. |
| 2.4.4 Linkzweck | Fail | PDF-Link mit `{{PROJEKTNAME}}`, kurzer Link "Exposé". |
| 2.4.6 Ueberschriften & Labels | Fail | Exit-Intent E-Mail nur Placeholder; Pflichtfeldhinweise nur Stern. |
| 2.4.7 Fokus sichtbar | Fail | Fokus sichtbar, aber teils zu kontrastarm; Detailpanel-Buttons ohne explizite Fokusklassen (`Wohnungsfinder.tsx:367-378`). |
| 2.5.3 Beschriftung im Namen | Pass mit Restrisiko | Die meisten Buttons enthalten sichtbaren Text; Galerie `vergroessern` sollte sprachlich konsistent werden. |
| 2.5.8 Zielgroesse | Nicht voll verifiziert | CTA-Buttons ok; Footer-/Textlinks pruefen und ggf. min-height 24px setzen. |
| 3.1.1 Sprache der Seite | Pass | `<html lang="de-AT">` (`app/layout.tsx:62`). |
| 3.1.2 Sprache von Teilen | Pass mit Restrisiko | Kurze fremdsprachige Eigennamen vorhanden; kein harter Fail. |
| 3.2.1 Bei Fokus | Pass mit Restrisiko | Kein Kontextwechsel bei Fokus gefunden; Consent initial fokussiert beim Erscheinen. |
| 3.2.2 Bei Eingabe | Pass | Keine automatische Formularabsendung bei Eingabe gefunden. |
| 3.3.1 Fehlererkennung | Fail | Submit-Fehler wird geworfen, nicht nutzerfreundlich angezeigt (`Kontakt.tsx:84-85`). |
| 3.3.2 Labels/Anweisungen | Fail | Pflichtfelder nur Stern; Exit-Intent Placeholder-Label. |
| 3.3.3 Fehlervorschlaege | Fail | Keine konkreten Korrekturhinweise/aria-describedby fuer Formularfehler. |
| 3.3.4 Fehlervermeidung | N/A | Keine rechtlich bindende Transaktion im Formularabschluss. |
| 4.1.2 Name, Rolle, Wert | Fail | `<tr role="button">`, Accordion ohne `aria-controls`, Exit-Intent ohne Dialogrolle. |
| 4.1.3 Statusmeldungen | Fail | Erfolg/Fehler im Kontaktformular nicht per `aria-live`/`role=status|alert`. |

## Vorschlag: Barrierefreiheitserklaerung

Empfohlene Route: `app/barrierefreiheit/page.tsx` und Footer-Link
"Barrierefreiheit".

Textvorschlag:

> Erklaerung zur Barrierefreiheit
>
> Die Immobilien- und Sachverstaendigenbuero Thomas Grasl ist bemueht, die
> Website "Vallis Achen Residenzen" im Einklang mit den Anforderungen des
> Barrierefreiheitsgesetzes, EN 301 549 und WCAG 2.1 Konformitaetsstufe AA
> barrierefrei zugaenglich zu machen.
>
> Stand der Vereinbarkeit: Diese Website ist derzeit teilweise vereinbar. Die
> wichtigsten bekannten Abweichungen betreffen einzelne interaktive Komponenten
> des Wohnungsfinders, Modal-/Lightbox-Fokusfuehrung, Formular-Statusmeldungen
> und einzelne Kontrastwerte. Die Behebung ist geplant.
>
> Nicht barrierefreie Inhalte: Interaktive Grundriss-Lightbox und Exit-Intent-
> Popup erfuellen die Modal-Fokusregeln noch nicht vollstaendig. Einige
> Metadaten/Downloads enthalten noch technische Platzhalter. Einzelne
> Schmuck-/Galerieinhalte benoetigen praezisere Textalternativen.
>
> Feedback und Kontakt: Wenn Ihnen Barrieren auffallen, kontaktieren Sie uns
> bitte unter office@grasl-immobilien.at oder telefonisch unter +43 5242 66666.
> Bitte beschreiben Sie die betroffene Seite/Funktion und das verwendete
> Hilfsmittel oder Geraet.
>
> Erstellung dieser Erklaerung: 10. Juni 2026. Grundlage ist ein technischer
> Accessibility-Audit des Repositorys und eine teilweise lokale Renderpruefung.

## CI-Empfehlung

1. Build-Gate: `npm run lint`, `npm run typecheck`, `npm run build`.
2. Placeholder-Gate: kleines Script, das `{{...}}` in `app`, `components`,
   `config`, `public` und gerendertem HTML blockiert, ausser explizit erlaubten
   Mustern.
3. A11y-Smoke: Playwright + `@axe-core/playwright` fuer `/`, `/datenschutz`,
   `/impressum`, `/quellenverzeichnis`, `/barrierefreiheit`.
4. Wohnungsfinder-Test: Tastaturpfad per Playwright:
   Tab bis "Top 2 Details anzeigen", Enter, `aria-expanded=true`, Tab zu
   "Grundriss Top 2 vergroessern", Enter, Dialog-Fokus bleibt gefangen, Esc
   schliesst und Fokus kehrt zum Ausloeser zurueck.
5. Formular-Test: leeres Submit erzeugt sichtbare Fehlermeldungen mit
   `role="alert"` und `aria-describedby`; erfolgreicher Submit erzeugt
   `role="status"`.

Beispiel-Skript nach Installation:

```json
{
  "scripts": {
    "test:a11y": "playwright test tests/a11y.spec.ts",
    "check:placeholders": "node scripts/check-placeholders.mjs"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.10.2",
    "@playwright/test": "^1.45.0"
  }
}
```

Keine Accessibility-Overlay-Widgets empfohlen; die Behebung soll im Markup,
CSS und Komponentenverhalten erfolgen.
