# Mitmachen

Danke, dass du Gordon verbessern willst.

## Ablauf

1. Für größere Änderungen erst ein Issue öffnen und den Ansatz abstimmen.
2. Fork anlegen, Branch erstellen, Änderung umsetzen.
3. In `addin/` und `proxy/` jeweils prüfen:
   ```bash
   npm run typecheck
   npm test
   npm run build
   ```
4. Pull Request mit kurzer Beschreibung öffnen: Was ändert sich, warum, wie getestet.

Commits brauchen eine `Signed-off-by`-Zeile (`git commit -s`), siehe unten.

## Regeln

- Keine API-Keys, Tokens, Kundendaten oder echten Personennamen in Code, Tests oder Issues.
- Neue Proxy-Funktionen dürfen keine Suchbegriffe oder Personendaten loggen.
- Tests für neue Logik in `*.test.ts` neben der Datei ablegen.

## Lizenz deiner Beiträge

Gordon steht unter der AGPL-3.0 und wird zusätzlich unter einer kommerziellen Lizenz angeboten (siehe [README](README.md#lizenz)). Damit das möglich bleibt, gilt für jeden Beitrag:

Mit der `Signed-off-by`-Zeile bestätigst du das [Developer Certificate of Origin 1.1](https://developercertificate.org/), also dass du den Beitrag einreichen darfst. Außerdem räumst du dem Maintainer das nicht ausschließliche, unbefristete, weltweite und unwiderrufliche Recht ein, deinen Beitrag auch unter anderen Lizenzbedingungen als der AGPL-3.0 zu nutzen und weiterzugeben. Dein Beitrag bleibt für alle anderen unter der AGPL-3.0 verfügbar.
