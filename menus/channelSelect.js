const { MessageFlags }   = require('discord.js');
const customIds          = require('../utils/customIds');
const sessionStore       = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');
const { buildMentionTypeRow } = require('./mentionTypeSelect');

async function execute(interaction) {
  const key     = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session?.title) {
    await interaction.reply({
      content: '⚠️ Sesi tidak ditemukan. Mulai ulang dari panel.',
      flags:   MessageFlags.Ephemeral,
    });
    return;
  }

  session.targetChannelId = interaction.values[0];
  sessionStore.setSession(key, session.guildId, session.userId, session);

  await interaction.reply({
    content:    '🔔 Pilih jenis mention:',
    components: [buildMentionTypeRow()],
    flags:      MessageFlags.Ephemeral,
  });
}

module.exports = { customId: customIds.CHANNEL_SELECT, execute };
