const { MessageFlags } = require('discord.js');
const customIds              = require('../utils/customIds');
const sessionStore           = require('../database/sessionStore');
const { buildSessionKey }    = require('../utils/sessionKey');
const { buildBuilderPayload } = require('../handlers/builderFlow');

async function execute(interaction) {
  const key     = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session) {
    await interaction.reply({
      content: '⚠️ Sesi tidak ditemukan. Mulai ulang dari panel.',
      flags:   MessageFlags.Ephemeral,
    });
    return;
  }

  session.timestamp = !session.timestamp;
  sessionStore.setSession(key, session.guildId, session.userId, session);

  await interaction.reply(buildBuilderPayload(session));
}

module.exports = { customId: customIds.BTN_TOGGLE_TIMESTAMP, execute };
