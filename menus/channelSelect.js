const { ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const customIds = require('../utils/customIds');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');

function buildMentionTypeRow() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customIds.MENTION_TYPE_SELECT)
    .setPlaceholder('Pilih mention...')
    .addOptions(
      { label: 'Tidak ada', value: 'none', emoji: '🚫' },
      { label: '@everyone', value: 'everyone', emoji: '📣' },
      { label: '@here', value: 'here', emoji: '🔔' },
      { label: 'Role tertentu', value: 'role', emoji: '🏷️' },
    );
  return new ActionRowBuilder().addComponents(menu);
}

async function execute(interaction) {
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session) {
    await interaction.reply({ content: '⚠️ Sesi tidak ditemukan. Mulai ulang dari panel.', flags: MessageFlags.Ephemeral });
    return;
  }

  session.targetChannelId = interaction.values[0];
  sessionStore.setSession(key, session.guildId, session.userId, session);

  await interaction.reply({
    content: '🔔 Pilih jenis mention untuk pengumuman ini:',
    components: [buildMentionTypeRow()],
    flags: MessageFlags.Ephemeral,
  });
}

module.exports = { customId: customIds.CHANNEL_SELECT, execute, buildMentionTypeRow };
