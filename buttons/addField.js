const { MessageFlags } = require('discord.js');
const customIds = require('../utils/customIds');
const { buildFieldModal } = require('../modals/infoModalField');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');

async function execute(interaction) {
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session) {
    await interaction.reply({ content: '⚠️ Sesi tidak ditemukan. Mulai ulang dari panel.', flags: MessageFlags.Ephemeral });
    return;
  }

  await interaction.showModal(buildFieldModal());
}

module.exports = { customId: customIds.BTN_ADD_FIELD, execute };
