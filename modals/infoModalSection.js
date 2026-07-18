const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags,
} = require('discord.js');
const customIds              = require('../utils/customIds');
const sessionStore           = require('../database/sessionStore');
const { buildSessionKey }    = require('../utils/sessionKey');
const { validateSection, LIMITS } = require('../utils/validators');
const { buildBuilderPayload } = require('../handlers/builderFlow');

/**
 * Membangun modal penambahan bagian (section).
 * Setiap bagian memiliki judul (wajib) dan deskripsi (opsional).
 * Maksimal 5 bagian per pengumuman, 2 bagian per modal.
 */
function buildSectionModal() {
  const modal = new ModalBuilder()
    .setCustomId(customIds.MODAL_SECTION)
    .setTitle('Tambah Bagian Konten');

  const name1 = new TextInputBuilder()
    .setCustomId('name1')
    .setLabel('Judul Bagian 1 (wajib)')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(256)
    .setRequired(true);

  const value1 = new TextInputBuilder()
    .setCustomId('value1')
    .setLabel('Deskripsi Bagian 1 (opsional)')
    .setPlaceholder('Biarkan kosong jika tidak diperlukan.')
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(1024)
    .setRequired(false);

  const name2 = new TextInputBuilder()
    .setCustomId('name2')
    .setLabel('Judul Bagian 2 (opsional)')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(256)
    .setRequired(false);

  const value2 = new TextInputBuilder()
    .setCustomId('value2')
    .setLabel('Deskripsi Bagian 2 (opsional)')
    .setPlaceholder('Biarkan kosong jika tidak diperlukan.')
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(1024)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder().addComponents(name1),
    new ActionRowBuilder().addComponents(value1),
    new ActionRowBuilder().addComponents(name2),
    new ActionRowBuilder().addComponents(value2),
  );

  return modal;
}

async function execute(interaction) {
  const key     = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session) {
    await interaction.reply({
      content: '⚠️ Sesi tidak ditemukan atau sudah kedaluwarsa. Mulai ulang dari panel.',
      flags:   MessageFlags.Ephemeral,
    });
    return;
  }

  // Ambil pasangan judul + deskripsi dari modal
  const pairs = [
    [
      interaction.fields.getTextInputValue('name1').trim(),
      interaction.fields.getTextInputValue('value1').trim(),
    ],
    [
      interaction.fields.getTextInputValue('name2').trim(),
      interaction.fields.getTextInputValue('value2').trim(),
    ],
  ];

  const errors      = [];
  const newSections = [];

  for (const [name, value] of pairs) {
    if (!name) continue; // Bagian kosong dilewati

    const fieldErrors = validateSection(name, value);
    if (fieldErrors.length > 0) {
      errors.push(...fieldErrors);
      continue;
    }
    newSections.push({ name, value: value || '' });
  }

  session.sections = session.sections || [];

  if (session.sections.length + newSections.length > LIMITS.maxSections) {
    errors.push(`Jumlah bagian maksimal ${LIMITS.maxSections}.`);
  } else {
    session.sections.push(...newSections);
  }

  sessionStore.setSession(key, session.guildId, session.userId, session);

  const builderPayload = buildBuilderPayload(session);
  const prefix         = errors.length > 0 ? `⚠️ ${errors.join('\n')}\n\n` : '';

  await interaction.reply({ ...builderPayload, content: `${prefix}${builderPayload.content}` });
}

module.exports = { customId: customIds.MODAL_SECTION, buildSectionModal, execute };
