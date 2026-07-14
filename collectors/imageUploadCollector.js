const { MessageFlags } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');
const { validateImageAttachment } = require('../utils/validators');
const imageCache = require('../utils/imageCache');
const sessionStore = require('../database/sessionStore');
const { showPreview } = require('../handlers/previewFlow');

async function runImageUploadCollector(interaction, session, key) {
  await interaction.reply({
    content: '📤 Silakan upload gambar (PNG/JPG/JPEG/WEBP) dalam waktu 60 detik, atau ketik `skip` untuk melanjutkan tanpa gambar.',
    flags: MessageFlags.Ephemeral,
  });

  const channel = interaction.channel;
  const collector = channel.createMessageCollector({
    filter: (message) => message.author.id === interaction.user.id,
    time: config.imageUploadTimeoutMs,
  });

  collector.on('collect', async (message) => {
    try {
      const content = message.content.trim().toLowerCase();

      if (content === 'skip') {
        session.image = null;
        await message.delete().catch(() => {});
        collector.stop('resolved');
        return;
      }

      const attachment = message.attachments.first();
      if (!attachment) {
        await interaction.followUp({
          content: '⚠️ Upload gambar (PNG/JPG/JPEG/WEBP) atau ketik `skip` untuk melanjutkan tanpa gambar.',
          flags: MessageFlags.Ephemeral,
        });
        await message.delete().catch(() => {});
        return;
      }

      const errors = validateImageAttachment(attachment, config.maxImageSizeMb);
      if (errors.length > 0) {
        await interaction.followUp({ content: `⚠️ ${errors.join(' ')}`, flags: MessageFlags.Ephemeral });
        await message.delete().catch(() => {});
        return;
      }

      const response = await fetch(attachment.url);
      const buffer = Buffer.from(await response.arrayBuffer());
      const filename = attachment.name || `image-${Date.now()}.png`;
      imageCache.setImage(key, buffer, filename);
      session.image = { name: filename };

      await message.delete().catch(() => {});
      collector.stop('resolved');
    } catch (err) {
      logger.error('IMAGE_COLLECTOR', 'Gagal memproses upload gambar', err);
      collector.stop('error');
    }
  });

  collector.on('end', async (_collected, reason) => {
    try {
      if (reason === 'time') {
        session.image = session.image || null;
        await interaction.followUp({
          content: '⏰ Waktu upload gambar habis. Melanjutkan tanpa gambar.',
          flags: MessageFlags.Ephemeral,
        });
      }

      sessionStore.setSession(key, session.guildId, session.userId, session);
      await showPreview(interaction, session, key);
    } catch (err) {
      logger.error('IMAGE_COLLECTOR', 'Gagal menampilkan preview', err);
    }
  });
}

module.exports = { runImageUploadCollector };
