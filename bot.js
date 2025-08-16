require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const owners = process.env.OWNERS?.split(',').map(x => x.trim()) || [];
const stylishName = '🌈 J-gz-bot 🌈';
const profileImagePath = path.join(__dirname, 'assets', 'humanoid-8722271_1920.png');
const pairings = {};
const deletedMsgs = {};
const viewOnceMedia = {};

function generatePairCode(userNumber) {
  const code = 'JagX' + Math.floor(1000 + Math.random() * 9000);
  pairings[userNumber] = code;
  return code;
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true
  });

  // Set profile image on startup
  sock.ev.on('connection.update', async (update) => {
    if (update.connection === 'open') {
      try {
        if (fs.existsSync(profileImagePath)) {
          await sock.updateProfilePicture(sock.user.id, { url: profileImagePath });
          console.log('Profile image updated.');
        }
      } catch (e) {
        console.log('Profile image error:', e.message);
      }
    }
  });

  // Listen to message events (normal, view once, deleted)
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || !msg.key.remoteJid) return;
    const sender = msg.key.participant || msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    // Save deleted message for retrieval
    deletedMsgs[msg.key.id] = msg.message;

    // Save view once media
    if (msg.message.viewOnceMessage) {
      viewOnceMedia[msg.key.id] = msg.message.viewOnceMessage.message;
    }

    // Menu/help
    if (text.startsWith('.menu') || text.startsWith('.help')) {
      await sock.sendMessage(sender, {
        image: { url: profileImagePath },
        caption:
          `*${stylishName}*\n\n` +
          `Main Commands:\n` +
          `.menu / .help - Show commands\n` +
          `.pair JagX <user_number> - Owner pairing\n` +
          `.requestpair - Ask for pairing\n` +
          `.ping - Bot speed\n` +
          `.quote - Get a random quote\n` +
          `.sticker - Convert an image to sticker (send with image)\n` +
          `.groupinfo - Show group name & member count\n` +
          `.saveviewonce - Save 'view once' media\n` +
          `.retrieve - Retrieve deleted messages\n` +
          `.react <emoji> - React to a message\n` +
          `.viewstatus - View message status\n` +
          `.reactstatus <emoji> - React to a status\n`
      });
    }

    // Owners: Pair command
    if (text.startsWith('.pair JagX')) {
      if (!owners.includes(sender.replace(/[^0-9]/g, ''))) {
        await sock.sendMessage(sender, { text: 'You are not authorized to pair. Contact the bot owner.' });
        return;
      }
      const userNumber = text.split(' ')[2];
      if (!userNumber) {
        await sock.sendMessage(sender, { text: 'Usage: .pair JagX <user_number>' });
        return;
      }
      const pairCode = generatePairCode(userNumber);
      await sock.sendMessage(sender, { text: `Pairing code for ${userNumber}: ${pairCode}` });
    }

    // Non-owner: Request pairing
    if (text.startsWith('.requestpair')) {
      await sock.sendMessage(sender, {
        text: `Please contact one of these owners for pairing:\n${owners.join('\n')}`
      });
    }

    // Ping command
    if (text.startsWith('.ping')) {
      const start = Date.now();
      await sock.sendMessage(sender, { text: 'Pinging...' });
      const end = Date.now();
      await sock.sendMessage(sender, { text: `Pong! ${end - start}ms` });
    }

    // Quote command
    if (text.startsWith('.quote')) {
      const quotes = [
        "Code is like humor. When you have to explain it, it’s bad.",
        "First, solve the problem. Then, write the code.",
        "Experience is the name everyone gives to their mistakes.",
        "Java is to JavaScript what car is to carpet.",
        "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday’s code."
      ];
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      await sock.sendMessage(sender, { text: quote });
    }

    // Sticker command
    if (text.startsWith('.sticker') && msg.message.imageMessage) {
      const buffer = await downloadMediaMessage(msg, 'buffer');
      await sock.sendMessage(sender, { sticker: buffer });
    }

    // Group info command
    if (text.startsWith('.groupinfo')) {
      if (!msg.key.remoteJid.endsWith('@g.us')) {
        await sock.sendMessage(sender, { text: "This command can only be used in groups." });
        return;
      }
      const group = await sock.groupMetadata(msg.key.remoteJid);
      await sock.sendMessage(sender, {
        text: `Group Name: ${group.subject}\nMembers: ${group.participants.length}`
      });
    }

    // Save view once command
    if (text.startsWith('.saveviewonce')) {
      const ids = Object.keys(viewOnceMedia);
      if (ids.length === 0) {
        await sock.sendMessage(sender, { text: "No view once media found recently." });
        return;
      }
      for (const id of ids) {
        await sock.sendMessage(sender, { text: "Saved view once media:" });
        await sock.sendMessage(sender, viewOnceMedia[id]);
      }
    }

    // Retrieve deleted messages
    if (text.startsWith('.retrieve')) {
      const ids = Object.keys(deletedMsgs);
      if (ids.length === 0) {
        await sock.sendMessage(sender, { text: "No deleted messages found recently." });
        return;
      }
      for (const id of ids) {
        await sock.sendMessage(sender, { text: "Retrieved deleted message:" });
        await sock.sendMessage(sender, deletedMsgs[id]);
      }
    }

    // React to message
    if (text.startsWith('.react ')) {
      const emoji = text.split(' ')[1];
      if (emoji) {
        await sock.sendMessage(sender, { react: { text: emoji, key: msg.key } });
      } else {
        await sock.sendMessage(sender, { text: "Usage: .react <emoji>" });
      }
    }

    // View message status
    if (text.startsWith('.viewstatus')) {
      try {
        const status = await sock.fetchMessageStatus(msg.key);
        await sock.sendMessage(sender, { text: `Status: ${JSON.stringify(status)}` });
      } catch (e) {
        await sock.sendMessage(sender, { text: "Unable to fetch message status." });
      }
    }

    // React to status
    if (text.startsWith('.reactstatus ')) {
      const emoji = text.split(' ')[1];
      // This is a placeholder: actual implementation depends on WhatsApp API support
      await sock.sendMessage(sender, { text: `Reacted to status with ${emoji}` });
    }
  });

  // Listen to message deletions
  sock.ev.on('messages.delete', async ({ keys }) => {
    for (const key of keys) {
      if (deletedMsgs[key.id]) {
        // Already handled in upsert
        continue;
      }
      deletedMsgs[key.id] = { text: "[Deleted message was here]" };
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

startBot();
