const { MessageFlags } = require('discord.js');
const customIds                = require('../utils/customIds');
const sessionStore             = require('../database/sessionStore');
const { buildSessionKey }      = require('../utils/sessionKey');
const { runImageUploadCollector } = require('../collectors/imageUploadCollector');

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

  await runImageUploadCollector(interaction, session, key);
}

module.exports = { customId: customIds.BTN_CONTINUE_UPLOAD, execute };
