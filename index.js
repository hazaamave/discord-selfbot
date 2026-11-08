require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const express = require('express');

// 1. Initialize Discord Selfbot Client
const client = new Client({
  checkUpdate: false, // Disables the startup update check log
});

// 2. Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Basic health-check and status endpoint
app.get('/status', (req, res) => {
  res.json({
    online: client.isReady(),
    user: client.user ? client.user.tag : null,
    uptime: client.uptime,
  });
});

// 3. Discord Client Events
client.on('ready', async () => {
  console.log(`[Discord] Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages from others unless needed; example self-command trigger
  if (message.author.id !== client.user.id) return;

  if (message.content === '!ping') {
    await message.edit('Pong!');
  }
});

// 4. Start Express Server and Login to Discord
app.listen(PORT, () => {
  console.log(`[Express] Server listening on http://localhost:${PORT}`);
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('[Discord] Failed to login:', err.message);
});