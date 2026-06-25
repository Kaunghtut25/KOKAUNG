import 'dotenv/config';
import { Telegraf } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.warn('TELEGRAM_BOT_TOKEN not set — bot will not start');
  process.exit(0);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(
    'Welcome to A9 Global Travels & Tours! 🌤️\n\n' +
    'I can help you with:\n' +
    '/tours - Browse tour packages\n' +
    '/booking - Check booking status\n' +
    '/faq - Frequently asked questions\n' +
    '/contact - Contact information'
  );
});

bot.command('faq', (ctx) => {
  ctx.reply(
    'FAQ:\n\n' +
    'Q: How do I book a tour?\n' +
    'A: Visit our website and select your preferred package.\n\n' +
    'Q: What payment methods are accepted?\n' +
    'A: KBZ Pay and Wave Pay are supported.'
  );
});

bot.launch().then(() => console.log('Telegram bot started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
