const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const customIds = require('../utils/customIds');
const { LIMITS } = require('../utils/validators');

function buildBuilderComponents(session) {
  const fieldCount = session.fields ? session.fields.length : 0;
  const canAddField = fieldCount < LIMITS.maxFields;

  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(customIds.BTN_ADD_FIELD)
        .setLabel(`Tambah Field (${fieldCount})`)
        .setEmoji('➕')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!canAddField),
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

function buildBuilderContent(session) {
  const category = session.category ? `${session.category.emoji} ${session.category.label}` : 'Tidak diketahui';
  const fieldCount = session.fields ? session.fields.length : 0;

  return (
    `🛠️ **Membuat Informasi - ${category}**\n\n` +
    `Judul: ${session.title}\n` +
    `Field tambahan: ${fieldCount}\n` +
    `Timestamp: ${session.timestamp ? 'ON' : 'OFF'}\n\n` +
    'Tambahkan field tambahan, atur timestamp, atau lanjutkan ke upload gambar.'
  );
}

function buildBuilderPayload(session) {
  return {
    content: buildBuilderContent(session),
    embeds: [],
    files: [],
    components: buildBuilderComponents(session),
  };
}

module.exports = { buildBuilderPayload, buildBuilderComponents, buildBuilderContent };
