const { REST, Routes } = require('discord.js');
const config = require('./config');
const logger = require('./utils/logger');
const { loadCommands } = require('./handlers/commandHandler');

async function deploy() {
  const commands = loadCommands();
  const body = commands.map((command) => command.data.toJSON());

  const rest = new REST().setToken(config.token);

  try {
    logger.info('DEPLOY', `Mendaftarkan ${body.length} slash command secara global...`);
    await rest.put(Routes.applicationCommands(config.clientId), { body });
    logger.info(
      'DEPLOY',
      'Slash command berhasil didaftarkan. Perubahan bisa memakan waktu hingga 1 jam untuk muncul di semua server.',
    );
  } catch (err) {
    logger.error('DEPLOY', 'Gagal mendaftarkan slash command', err);
    process.exit(1);
  }
}

deploy();
