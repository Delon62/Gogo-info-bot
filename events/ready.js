const { Events, ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.info('READY', `${client.user.tag} online dan siap digunakan.`);
    client.user.setPresence({
      status: 'online',
      activities: [{ name: 'Information Center', type: ActivityType.Watching }],
    });
  },
};
