const { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const customIds        = require('../utils/customIds');
const { buildInfoEmbed } = require('../embeds/infoEmbed');
const imageCache         = require('../utils/imageCache');

function buildPreviewComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(customIds.BTN_PREVIEW_SEND)
        .setLabel('Kirim')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(customIds.BTN_PREVIEW_EDIT)
        .setLabel('Edit')
        .setEmoji('✏️')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(customIds.BTN_PREVIEW_CANCEL)
        .setLabel('Batal')
        .setEmoji('❌')
        .setStyle(ButtonStyle.Danger),
    ),
  ];
}

async function showPreview(interaction, session, key) {
  const embed  = buildInfoEmbed(session);
  const files  = [];
  const cached = imageCache.getImage(key);
  if (cached) {
    files.push(new AttachmentBuilder(cached.buffer, { name: cached.filename }));
  }

  await interaction.followUp({
    content:    '👀 **Preview Pengumuman**',
    embeds:     [embed],
    files,
    components: buildPreviewComponents(),
  });
}

module.exports = { buildPreviewComponents, showPreview };
