const customIds = require('../utils/customIds');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');
const imageCache = require('../utils/imageCache');

async function execute(interaction) {
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  sessionStore.deleteSession(key);
  imageCache.clearImage(key);

  await interaction.update({
    content: '❌ Pembuatan pengumuman dibatalkan. Semua data telah dihapus.',
    embeds: [],
    components: [],
    files: [],
  });
}

module.exports = { customId: customIds.BTN_PREVIEW_CANCEL, execute };
