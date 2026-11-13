# Hosting – Gordon

Gordon besteht aus zwei Teilen mit unterschiedlichen Anforderungen:

| Teil | Was | Anforderung |
|------|-----|-------------|
| **Add-in-Bundle** | statisches HTML/JS/CSS (`addin/dist`) | nur statisches Hosting, HTTPS Pflicht |
| **Proxy** | Node-Server (hält API-Key, Limits, Cache) | dauerhaft laufender Prozess + kleiner Speicher für `users.json`/`usage.json` |

## Empfehlung (günstig/kostenlos)

### Add-in-Bundle → **Cloudflare Pages** (kostenlos) ✅
- Kostenlos, automatisches HTTPS, eigene Domain, schnelles CDN, unbegrenzter Traffic.
- **Schritt-für-Schritt-Anleitung: siehe [DEPLOY-ADDIN.md](DEPLOY-ADDIN.md).**
- Diese eine HTTPS-URL ist danach die feste Quelle im `manifest.xml` und der
  erlaubte CORS-Origin (`ALLOWED_ORIGIN`) des Proxy.
- **Nicht GitHub Pages:** Dessen Nutzungsbedingungen untersagen kommerzielle/SaaS-
  Nutzung und es erlaubt keine Cache-Header – beides hier ausschlaggebend.

### Proxy → selbst hosten

Der Proxy braucht einen **dauerhaft laufenden Prozess** und etwas **persistenten
Speicher** (für `users.json`/`usage.json`/`tenants.json`). Reines „Serverless"
(Cloudflare Workers, Vercel Functions) passt wegen der Dateipersistenz und des
In-Memory-Cache **nicht** ohne Umbau (dann Datenbank nötig).

Jede Organisation betreibt ihren eigenen Proxy mit ihrem eigenen
handelsregister.ai-API-Key. Geeignete Plattformen:

- **Hetzner Cloud CX22 (~4 €/Monat)** + Docker → bestes Preis-Leistungs-Verhältnis.
  TLS via **Caddy** (automatisches Let's Encrypt) davorschalten, siehe
  [DEPLOY-PROXY.md](DEPLOY-PROXY.md).
- **Fly.io** – kleine VM mit Volume.
- **Oracle Cloud „Always Free"** (Arm-Ampere-VM) – dauerhaft gratis, aber
  Einrichtung aufwändiger.
- **Vermeiden für eine API:** Render Free (schläft ein → Kaltstarts, kein Volume).

Über die Mandanten-Funktion im Admin-Panel kann ein Proxy mehrere Teams mit
jeweils eigenem API-Key bedienen.

**Kurz:** Add-in auf **Cloudflare Pages (gratis)**, Proxy auf **Hetzner-VPS + Docker
+ Caddy** (günstigster zuverlässiger Weg) bzw. **Fly.io/Oracle Always Free**, wenn
es gratis sein muss.

## Proxy per Docker starten

```bash
# Image bauen
docker build -t gordon-proxy ./proxy

# Starten (TLS terminiert der Reverse-Proxy davor; Container läuft intern HTTP)
docker run -d --name gordon-proxy \
  -p 3001:3001 \
  -e HANDELSREGISTER_API_KEY=__dein_key__ \
  -e ADMIN_TOKEN="$(openssl rand -hex 32)" \
  -e ALLOWED_ORIGIN=https://app.deine-domain.de \
  -v gordon_data:/data \
  gordon-proxy
```

- `ADMIN_TOKEN` setzen ⇒ **Nutzer-Token-Pflicht + Credit-Limits aktiv**.
- `-v …:/data` ⇒ `users.json`/`usage.json` bleiben über Neustarts erhalten.
- Davor einen Reverse-Proxy (Caddy/nginx/Traefik) mit gültigem TLS-Zertifikat;
  dieser leitet HTTPS extern auf den Container-Port 3001 (HTTP) intern.

## TLS-Hinweis
Im Container ist `office-addin-dev-certs` (nur Dev) **nicht** installiert, daher
läuft der Server intern bewusst über HTTP – die TLS-Terminierung übernimmt die
Plattform bzw. der Reverse-Proxy. Den Proxy **niemals** ohne vorgelagertes HTTPS
öffentlich erreichbar machen.

## Nach dem Deploy
1. `manifest.xml`-URLs auf die Add-in-Domain setzen, neue App-GUID vergeben.
2. Add-in zentral über das **Microsoft-365-Admin-Center** im eigenen Tenant
   ausrollen (privat/Enterprise, kein Store-Review).
3. Im Proxy je Nutzer über die **Admin-Oberfläche** `https://<proxy>/admin`
   (Login mit `ADMIN_TOKEN`) Zugänge anlegen und Credit-Limits setzen.
