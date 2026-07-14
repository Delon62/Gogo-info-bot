const { MessageFlags } = require('discord.js');
const customIds = require('../utils/customIds');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');
const { finalizeAndSend } = require('../handlers/sendFlow');

async function execute(interaction) {
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session) {
    await interaction.reply({ content: '⚠️ Sesi tidak ditemukan. Mulai ulang dari panel.', flags: MessageFlags.Ephemeral });
    return;
  }

  session.mentionRoleId = interaction.values[0];
  sessionStore.setSession(key, session.guildId, session.userId, session);

  await finalizeAndSend(interaction, session, key);
}

module.exports = { customId: customIds.ROLE_SELECT, execute };
