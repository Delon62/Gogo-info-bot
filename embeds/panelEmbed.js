const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const customIds = require('../utils/customIds');
const config = require('../config');

function buildPanelEmbed() {
  return new EmbedBuilder()
    .setColor(config.defaultEmbedColor)
    .setTitle('📢 INFO CENTER')
    .setDescription('Selamat datang di Information Center.\n\nKlik tombol di bawah untuk membuat pengumuman.')
    .setFooter({ text: `${config.botName} v${config.botVersion}` })
    .setTimestamp();
}

function buildPanelComponents() {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(customIds.PANEL_CREATE_INFO)
      .setLabel('Buat Informasi')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Primary),
  );
  return [row];
}

module.exports = { buildPanelEmbed, buildPanelComponents };
