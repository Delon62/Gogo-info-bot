const { EmbedBuilder } = require('discord.js');
const config = require('../config');

/**
 * Membangun embed informasi dari data sesi pengguna.
 * Judul wajib; deskripsi dan semua field lainnya opsional.
 */
function buildInfoEmbed(session) {
  const embed = new EmbedBuilder()
    .setColor(session.color || config.defaultEmbedColor)
    .setTitle(session.title);

  // Deskripsi opsional
  if (session.description?.trim()) {
    embed.setDescription(session.description);
  }

  // Kategori ditampilkan sebagai author
  if (session.category) {
    embed.setAuthor({ name: `${session.category.emoji} ${session.category.label}` });
  }

  // Bagian-bagian tambahan (sections)
  if (session.sections?.length > 0) {
    embed.addFields(
      session.sections.map((s) => ({
        name:  s.name,
        value: s.value || '\u200B', // zero-width space jika nilai kosong
      })),
    );
  }

  if (session.thumbnail) embed.setThumbnail(session.thumbnail);
  if (session.image?.name) embed.setImage(`attachment://${session.image.name}`);
  if (session.footer) embed.setFooter({ text: session.footer });
  if (session.timestamp) embed.setTimestamp();

  return embed;
}

module.exports = { buildInfoEmbed };
