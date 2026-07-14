const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const customIds = require('../utils/customIds');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');
const { validateField, LIMITS } = require('../utils/validators');
const { buildBuilderPayload } = require('../handlers/builderFlow');

function buildFieldModal() {
  const modal = new ModalBuilder().setCustomId(customIds.MODAL_FIELD).setTitle('Tambah Field Tambahan');

  const name1 = new TextInputBuilder().setCustomId('name1').setLabel('Nama Field 1').setStyle(TextInputStyle.Short).setMaxLength(256).setRequired(true);
  const value1 = new TextInputBuilder()
    .setCustomId('value1')
    .setLabel('Isi Field 1')
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(1024)
    .setRequired(true);
  const name2 = new TextInputBuilder()
    .setCustomId('name2')
    .setLabel('Nama Field 2 (opsional)')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(256)
    .setRequired(false);
  const value2 = new TextInputBuilder()
    .setCustomId('value2')
    .setLabel('Isi Field 2 (opsional)')
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
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session) {
    await interaction.reply({ content: '⚠️ Sesi tidak ditemukan atau sudah kedaluwarsa. Mulai ulang dari panel.', flags: MessageFlags.Ephemeral });
    return;
  }

  const pairs = [
    [interaction.fields.getTextInputValue('name1').trim(), interaction.fields.getTextInputValue('value1').trim()],
    [interaction.fields.getTextInputValue('name2').trim(), interaction.fields.getTextInputValue('value2').trim()],
  ];

  const errors = [];
  const newFields = [];

  for (const [name, value] of pairs) {
    if (!name && !value) continue;
    if (!name || !value) {
      errors.push('Nama dan isi field harus diisi berdua jika ingin menambahkan field.');
      continue;
    }
    const fieldErrors = validateField(name, value);
    if (fieldErrors.length > 0) {
      errors.push(...fieldErrors);
      continue;
    }
    newFields.push({ name, value });
  }

  session.fields = session.fields || [];
  if (session.fields.length + newFields.length > LIMITS.maxFields) {
    errors.push(`Jumlah field maksimal ${LIMITS.maxFields}.`);
  } else {
    session.fields.push(...newFields);
  }

  sessionStore.setSession(key, session.guildId, session.userId, session);

  const builderPayload = buildBuilderPayload(session);
  const prefix = errors.length > 0 ? `⚠️ ${errors.join('\n')}\n\n` : '';

  await interaction.reply({ ...builderPayload, content: `${prefix}${builderPayload.content}` });
}

module.exports = { customId: customIds.MODAL_FIELD, buildFieldModal, execute };
