const { MessageFlags } = require('discord.js');
const customIds          = require('../utils/customIds');
const { canUsePanel }    = require('../utils/permissions');
const { getGuildConfig } = require('../database/guildConfig');
const sessionStore       = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');
const { buildCategoryRow } = require('../menus/categorySelect');

async function execute(interaction) {
  const guildConfig = getGuildConfig(interaction.guildId);
  if (!canUsePanel(interaction.member, guildConfig?.allowed_role_id)) {
    await interaction.reply({
      content: '❌ Anda tidak memiliki izin untuk membuat pengumuman.',
      flags:   MessageFlags.Ephemeral,
    });
    return;
  }

  const key     = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = { guildId: interaction.guildId, userId: interaction.user.id, sections: [], timestamp: false };
  sessionStore.setSession(key, session.guildId, session.userId, session);

  await interaction.reply({
    content:    '📂 Pilih kategori pengumuman:',
    components: [buildCategoryRow()],
    flags:      MessageFlags.Ephemeral,
  });
}

module.exports = { customId: customIds.PANEL_CREATE_INFO, execute };
