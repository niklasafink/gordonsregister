/* global Office, window */

declare const process: { env: { SUPPORT_EMAIL?: string } };

// Wird beim Build über die Umgebungsvariable SUPPORT_EMAIL gesetzt (siehe webpack.config.js).
const CONTACT_EMAIL = process.env.SUPPORT_EMAIL || "";

/**
 * Ribbon-Button „E-Mail": öffnet das Standard-Mailprogramm mit einer vorbereiteten
 * Nachricht an die Support-Adresse. Ohne SUPPORT_EMAIL bleibt der Empfänger leer.
 */
function sendEmail(event: Office.AddinCommands.Event): void {
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Support-Anfrage Gordon")}`;
  try {
    window.open(url, "_blank");
  } catch {
    /* ignore – Mail-Client nicht verfügbar */
  }
  event.completed();
}

Office.onReady(() => {
  Office.actions.associate("sendEmail", sendEmail);
});
