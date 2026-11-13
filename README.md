# Gordon

Excel-Add-in für Handelsregister- und Unternehmensdaten von [handelsregister.ai](https://handelsregister.ai).

*English: Gordon is an Excel add-in that pulls German commercial register and company data from the handelsregister.ai API into worksheets. A small self-hosted proxy keeps the API key on the server. Documentation is in German.*

Im Ribbon gibt es je handelsregister.ai-Feature einen Button. Ein Klick öffnet das Taskpane mit dem passenden Feature. Dort gibst du ein Unternehmen ein oder übernimmst es aus der markierten Zelle. Das Add-in fragt die Daten über deinen Proxy ab und schreibt sie als Tabelle ins Arbeitsblatt.

## Aufbau

```
Excel-Add-in (statisch, z. B. Cloudflare Pages)
        │  HTTPS, Nutzer-Token
        ▼
Proxy (Node/Express, selbst gehostet)   ← hält den API-Key, Nutzer, Limits, Cache
        │  HTTPS, API-Key
        ▼
handelsregister.ai
```

| Ordner | Inhalt |
|---|---|
| [addin/](addin/) | Office-Add-in (TypeScript, Office.js, Webpack) |
| [proxy/](proxy/) | Backend-Proxy mit Admin-Panel, Nutzer-Tokens, Credit-Limits und Mandanten |
| [docs/](docs/) | Hosting- und Deploy-Anleitungen |

**Den Proxy musst du selbst betreiben.** Es gibt keinen öffentlichen Gordon-Server, und der Proxy des Maintainers steht für fremde Installationen nicht zur Verfügung. Du brauchst einen eigenen API-Key von handelsregister.ai; die Abfragen laufen über dein Konto und kosten dort Credits.

## Features

`financial_kpi`, `balance_sheet_accounts`, `profit_and_loss_account`, `related_persons`, `publications`, `news`, `insolvency_publications`, `annual_financial_statements`, `annual_financial_statements__html`, `shareholders`, `ubos`, `shareholdings`, `website_content`

## Lokal starten

Voraussetzungen: Node.js 20+, Excel (Desktop oder Web), ein handelsregister.ai-API-Key.

```bash
# Proxy
cd proxy
cp .env.example .env          # HANDELSREGISTER_API_KEY eintragen
npm install
npm run dev                   # https://localhost:3001

# Add-in (zweites Terminal)
cd addin
npm install
npm run dev-certs             # einmalig: lokales HTTPS-Zertifikat
npm run start                 # https://localhost:3000
npm run sideload              # Add-in in Excel laden
```

Ohne `ADMIN_TOKEN` läuft der Proxy im offenen Modus ohne Login und Limits. Das ist nur für die lokale Entwicklung gedacht.

Tests und Typprüfung laufen in beiden Ordnern mit `npm test` und `npm run typecheck`.

## Produktiv betreiben

1. **Proxy** deployen: [docs/DEPLOY-PROXY.md](docs/DEPLOY-PROXY.md) (Docker + Caddy, Beispiel Hetzner). Überblick über Hosting-Optionen: [docs/HOSTING.md](docs/HOSTING.md).
2. **Add-in** bauen und ausliefern: [docs/DEPLOY-ADDIN.md](docs/DEPLOY-ADDIN.md).
3. **Eigene App-ID** vergeben: `<Id>` in [addin/manifest.xml](addin/manifest.xml) durch eine neue GUID ersetzen (`uuidgen`). So kollidiert dein Add-in nicht mit anderen Installationen.
4. Add-in über das Microsoft-365-Admin-Center in deiner Organisation verteilen.

Build-Variablen für das Add-in:

| Variable | Zweck |
|---|---|
| `ADDIN_BASE_URL` | Domain, unter der das Add-in liegt (wird ins Manifest geschrieben) |
| `PROXY_BASE_URL` | vorbelegte Proxy-Adresse; Nutzer können sie im Taskpane ändern |
| `SUPPORT_EMAIL` | Empfänger des Ribbon-Buttons „E-Mail“ |

Die Variablen des Proxys stehen in [proxy/.env.example](proxy/.env.example).

## Datenschutz

Der Proxy verarbeitet Suchbegriffe, die Personennamen enthalten können. Wer ihn für andere betreibt, ist dafür datenschutzrechtlich verantwortlich. Der Code hilft dabei: Nutzer-Tokens werden nur als Hash gespeichert, der Node-Proxy loggt keine Suchbegriffe, Abfrageergebnisse liegen nur im RAM (`CACHE_TTL_SECONDS`), und [proxy/Caddyfile.example](proxy/Caddyfile.example) entfernt Query-Strings aus den Access-Logs.

## Lizenz

Gordon steht unter der [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0-only).

Du darfst den Code nutzen, verändern und weitergeben, auch kommerziell. Wenn du eine veränderte Version betreibst und andere über das Netzwerk damit arbeiten, musst du ihnen den Quellcode deiner Version unter derselben Lizenz zugänglich machen.

**Kommerzielle Lizenz:** Wenn du Gordon in einem Produkt oder Dienst einsetzen willst, ohne die Pflichten der AGPL zu übernehmen, schreib an niklas.finke18@gmail.com. Eine Lizenz zu anderen Bedingungen ist möglich.

## Mitmachen

Issues und Pull Requests sind willkommen, siehe [CONTRIBUTING.md](CONTRIBUTING.md). Sicherheitslücken bitte nicht öffentlich melden, sondern wie in [SECURITY.md](SECURITY.md) beschrieben.

## Hinweis

Gordon ist ein unabhängiges Projekt und steht in keiner Verbindung zu handelsregister.ai, dem Gemeinsamen Registerportal der Länder oder Microsoft. Für die Nutzung der handelsregister.ai-API gelten deren Nutzungsbedingungen.
