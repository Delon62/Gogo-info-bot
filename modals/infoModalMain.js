const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const customIds = require('../utils/customIds');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');
const { validateMainFields } = require('../utils/validators');
const { resolveColor, colorChoicesText } = require('../utils/colors');
const config = require('../config');
const { buildBuilderPayload } = require('../handlers/builderFlow');

function buildMainModal(session = {}) {
  const modal = new ModalBuilder().setCustomId(customIds.MODAL_MAIN).setTitle('Buat Informasi - Data Utama');

  const titleInput = new TextInputBuilder().setCustomId('title').setLabel('Judul').setStyle(TextInputStyle.Short).setMaxLength(256).setRequired(true);
  if (session.title) titleInput.setValue(session.title);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('description')
    .setLabel('Deskripsi')
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(4000)
    .setRequired(true);
  if (session.description) descriptionInput.setValue(session.description);

  const footerInput = new TextInputBuilder()
    .setCustomId('footer')
    .setLabel('Footer (opsional)')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(2048)
    .setRequired(false);
  if (session.footer) footerInput.setValue(session.footer);

  const colorInput = new TextInputBuilder()
    .setCustomId('color')
    .setLabel('Warna Embed (opsional)')
    .setPlaceholder('biru/merah/hijau/hex/random')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(20)
    .setRequired(false);
  if (session.colorInputRaw) colorInput.setValue(session.colorInputRaw);

  const thumbnailInput = new TextInputBuilder()
    .setCustomId('thumbnail')
    .setLabel('Thumbnail URL (opsional)')
    .setPlaceholder('https://...')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(500)
    .setRequired(false);
  if (session.thumbnail) thumbnailInput.setValue(session.thumbnail);

  modal.addComponents(
    new ActionRowBuilder().addComponents(titleInput),
    new ActionRowBuilder().addComponents(descriptionInput),
    new ActionRowBuilder().addComponents(footerInput),
    new ActionRowBuilder().addComponents(colorInput),
    new ActionRowBuilder().addComponents(thumbnailInput),
  );

  return modal;
}

async function execute(interaction) {
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  let session = sessionStore.getSession(key);
  if (!session) {
    session = { guildId: interaction.guildId, userId: interaction.user.id, fields: [], timestamp: false };
  }

  const title = interaction.fields.getTextInputValue('title').trim();
  const description = interaction.fields.getTextInputValue('description').trim();
  const footer = interaction.fields.getTextInputValue('footer').trim();
  const colorRaw = interaction.fields.getTextInputValue('color').trim();
  const thumbnail = interaction.fields.getTextInputValue('thumbnail').trim();

  const resolvedColor = resolveColor(colorRaw, config.defaultEmbedColor);
  const errors = validateMainFields({ title, description, footer, thumbnail });
  if (colorRaw && resolvedColor === null) {
    errors.push(`Warna tidak dikenali. Gunakan: ${colorChoicesText()}`);
  }

  if (errors.length > 0) {
    await interaction.reply({ content: `⚠️ ${errors.join('\n')}`, flags: MessageFlags.Ephemeral });
    return;
  }

  session.title = title;
  session.description = description;
  session.footer = footer || null;
  session.colorInputRaw = colorRaw || null;
  session.color = resolvedColor;
  session.thumbnail = thumbnail || null;
  session.fields = session.fields || [];
  session.timestamp = session.timestamp || false;

  sessionStore.setSession(key, session.guildId, session.userId, session);

  await interaction.reply(buildBuilderPayload(session));
}

module.exports = { customId: customIds.MODAL_MAIN, buildMainModal, execute };
