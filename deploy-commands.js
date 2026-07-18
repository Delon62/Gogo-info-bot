/**
 * Script deploy-commands.js
 * Jalankan sekali untuk mendaftarkan slash command ke Discord:
 *   node deploy-commands.js
 */

require('dotenv').config();
const { REST, Routes, Collection } = require('discord.js');
const path   = require('path');
const fs     = require('fs');
const logger = require('./utils/logger');

const token    = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error('[DEPLOY] DISCORD_TOKEN dan CLIENT_ID wajib diisi di file .env');
  process.exit(1);
}

function loadCommands() {
  const commands    = new Collection();
  const commandsDir = path.join(__dirname, 'commands');
  const files       = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const cmd = require(path.join(commandsDir, file));
    if (cmd?.data) commands.set(cmd.data.name, cmd);
  }
  return commands;
}

(async () => {
  try {
    const commands = loadCommands();
    const body     = [...commands.values()].map((cmd) => cmd.data.toJSON());

    const rest = new REST().setToken(token);
    logger.info('DEPLOY', `Mendaftarkan ${body.length} slash command...`);
    await rest.put(Routes.applicationCommands(clientId), { body });
    logger.info('DEPLOY', 'Slash command berhasil didaftarkan!');
  } catch (err) {
    logger.error('DEPLOY', 'Gagal mendaftarkan slash command.', err);
    process.exit(1);
  }
})();
