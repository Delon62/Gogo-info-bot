const { Events } = require('discord.js');
const config = require('../config');
const { buildHelpEmbed } = require('../embeds/helpEmbed');
const logger = require('../utils/logger');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const command = message.content.trim().toLowerCase();
    if (command !== `${config.prefix}help`) return;

    try {
      await message.reply({ embeds: [buildHelpEmbed()] });
    } catch (err) {
      logger.error('MESSAGE_CREATE', 'Gagal mengirim pesan bantuan', err);
    }
  },
};
