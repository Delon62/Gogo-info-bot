const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const customIds    = require('../utils/customIds');
const { LIMITS }   = require('../utils/validators');

// --- Komponen ---

function buildBuilderComponents(session) {
  const sectionCount = session.sections?.length ?? 0;
  const canAddSection = sectionCount < LIMITS.maxSections;

  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(customIds.BTN_ADD_SECTION)
        .setLabel(`Tambah Bagian (${sectionCount}/${LIMITS.maxSections})`)
        .setEmoji('➕')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!canAddSection),

      new ButtonBuilder()
        .setCustomId(customIds.BTN_TOGGLE_TIMESTAMP)
        .setLabel(`Timestamp: ${session.timestamp ? 'ON' : 'OFF'}`)
        .setEmoji('🕐')
        .setStyle(session.timestamp ? ButtonStyle.Success : ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId(customIds.BTN_CONTINUE_UPLOAD)
        .setLabel('Lanjut ke Upload Gambar')
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Primary),
    ),
  ];
}

// --- Teks status ---

function buildBuilderContent(session) {
  const category     = session.category ? `${session.category.emoji} ${session.category.label}` : 'Tidak diketahui';
  const sectionCount = session.sections?.length ?? 0;
  const desc         = session.description?.trim() ? '✅ Diisi' : '*(kosong)*';

  return (
    `🛠️ **Membuat Informasi — ${category}**\n\n` +
    `📌 **Judul:** ${session.title}\n` +
    `📝 **Deskripsi:** ${desc}\n` +
    `📂 **Bagian tambahan:** ${sectionCount}/${LIMITS.maxSections}\n` +
    `🕐 **Timestamp:** ${session.timestamp ? 'ON' : 'OFF'}\n\n` +
    'Tambah bagian konten, atur timestamp, atau lanjutkan ke upload gambar.'
  );
}

// --- Payload lengkap untuk di-reply ---

function buildBuilderPayload(session) {
  return {
    content:    buildBuilderContent(session),
    embeds:     [],
    files:      [],
    components: buildBuilderComponents(session),
  };
}

module.exports = { buildBuilderPayload, buildBuilderComponents, buildBuilderContent };
