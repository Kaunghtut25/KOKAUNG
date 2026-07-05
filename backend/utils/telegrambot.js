const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Sends a formatted booking alert to the admin Telegram channel.
 * @param {Object} booking - The booking Mongoose document
 * @param {Object} user - The user Mongoose document
 * @returns {Promise<void>}
 */
async function sendBookingAlert(booking, user) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[TelegramBot] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Skipping alert.');
    return;
  }

  const shortId = booking._id.toString().slice(-8).toUpperCase();

  const message = [
    '🛎️ *New Booking Received!*',
    '━━━━━━━━━━━━━━━━━',
    `📋 Booking ID: #${shortId}`,
    `👤 Customer: ${user.name}`,
    `📧 Email: ${user.email}`,
    `📞 Phone: ${user.phone || 'N/A'}`,
    `📦 Type: ${booking.itemType.toUpperCase()}`,
    `💰 Amount: ${booking.totalPrice.toLocaleString()} MMK`,
    `💳 Payment: ${booking.paymentMethod || 'N/A'}`,
    `📅 Date: ${new Date(booking.createdAt).toLocaleDateString()}`,
    '━━━━━━━━━━━━━━━━━',
  ].join('\n');

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        parse_mode: 'Markdown',
        text: message,
      },
      { timeout: 10000 }
    );
    console.log(`[TelegramBot] Alert sent for booking #${shortId}`);
  } catch (err) {
    console.error('[TelegramBot] Failed to send alert:', err.response?.data || err.message);
  }
}

module.exports = { sendBookingAlert };
