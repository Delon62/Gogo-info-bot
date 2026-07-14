const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, MessageFlags } = require('discord.js');
const customIds = require('../utils/customIds');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');

function buildChannelSelectRow() {
  const menu = new ChannelSelectMenuBuilder()
    .setCustomId(customIds.CHANNEL_SELECT)
    .setPlaceholder('Pilih channel tujuan...')
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement);
  return new ActionRowBuilder().addComponents(menu);
}

async function execute(interaction) {
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session || !session.title) {
    await interaction.reply({ content: '⚠️ Sesi tidak ditemukan. Mulai ulang dari panel.', flags: MessageFlags.Ephemeral });
    return;
  }

  await interaction.reply({
    content: '📨 Pilih channel tujuan pengumuman:',
    components: [buildChannelSelectRow()],
    flags: MessageFlags.Ephemeral,
  });
}

module.exports = { customId: customIds.BTN_PREVIEW_SEND, execute, buildChannelSelectRow };
