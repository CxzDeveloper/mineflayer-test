const mineflayer = require('mineflayer');

const botUsername = 'cxzalt1';
const botPassword = 'cxzdev';
const serverHost = 'kalwi.id';
const serverPort = 25565;

function createBot() {
  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: botUsername,
  });

  bot.on('spawn', () => {
    console.log('Bot berhasil login.');
    bot.chat(`/login ${botPassword}`);
    setTimeout(() => bot.chat('/play acidisland'), 3000);
    startAfk(bot);
  });

  bot.on('message', (jsonMsg) => {
    const msg = jsonMsg.toString();
    console.log('[CHAT]', msg);

    // Auto island join jika bot belum terdaftar
    if (msg.includes('You do not have an island')) {
      console.log('Menunggu undangan island...');
    }

    // Jika bot mendapat undangan dari kamu
    if (msg.toLowerCase().includes('has invited you to join their island')) {
      const match = msg.match(/(.+?) has invited you to join/i);
      if (match) {
        const inviter = match[1];
        setTimeout(() => {
          bot.chat(`/ai accept ${inviter}`);
          console.log(`Menerima undangan dari ${inviter}`);
        }, 3000);
      }
    }

    // Auto register/login (jaga-jaga)
    if (msg.toLowerCase().includes('/register')) {
      bot.chat(`/register ${botPassword} ${botPassword}`);
    }
    if (msg.toLowerCase().includes('/login')) {
      bot.chat(`/login ${botPassword}`);
    }

    // Chat games - reverse text
    const reverseMatch = msg.match(/Unreverse: (.+)/i);
    if (reverseMatch) {
      const reversed = reverseMatch[1].split('').reverse().join('');
      setTimeout(() => {
        bot.chat(reversed);
      }, Math.floor(Math.random() * 2000) + 6200); // ~8.2 detik
    }

    // Chat games - ketik huruf/angka acak
    const typeMatch = msg.match(/Type the word: ([a-zA-Z0-9]+)/i);
    if (typeMatch) {
      setTimeout(() => {
        bot.chat(typeMatch[1]);
      }, Math.floor(Math.random() * 2000) + 6200);
    }
  });

  bot.on('end', () => {
    console.log('Bot disconnect. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => {
    console.log('Error:', err.code);
    if (err.code === 'ECONNRESET') {
      console.log('Connection reset. Reconnecting...');
      setTimeout(createBot, 5000);
    }
  });
}

function startAfk(bot) {
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 60000); // jump tiap 60 detik
}

createBot();
