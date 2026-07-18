const { Events, ActivityType, REST, Routes } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');

async function autoDeployCommands(commands) {
  if (!commands?.size) return;

  try {
    const body = [...commands.values()].map((cmd) => cmd.data.toJSON());
    const rest  = new REST().setToken(config.token);
    await rest.put(Routes.applicationCommands(config.clientId), { body });
    logger.info('DEPLOY', `${body.length} slash command terdaftar otomatis saat startup.`);
  } catch (err) {
    logger.error('DEPLOY', 'Gagal mendaftarkan slash command otomatis saat startup.', err);
  }
}

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client, { commands } = {}) {
    logger.info('READY', `${client.user.tag} online dan siap digunakan.`);
    client.user.setPresence({
      status:     'online',
      activities: [{ name: 'Information Center', type: ActivityType.Watching }],
    });
    await autoDeployCommands(commands);
  },
};
