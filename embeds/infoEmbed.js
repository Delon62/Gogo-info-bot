const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function buildInfoEmbed(session) {
  const embed = new EmbedBuilder().setColor(session.color || config.defaultEmbedColor).setTitle(session.title).setDescription(session.description);

  if (session.category) {
    embed.setAuthor({ name: `${session.category.emoji} ${session.category.label}` });
  }

  if (session.fields && session.fields.length > 0) {
    embed.addFields(session.fields.map((field) => ({ name: field.name, value: field.value })));
  }

  if (session.thumbnail) {
    embed.setThumbnail(session.thumbnail);
  }

  if (session.image && session.image.name) {
    embed.setImage(`attachment://${session.image.name}`);
  }

  if (session.footer) {
    embed.setFooter({ text: session.footer });
  }

  if (session.timestamp) {
    embed.setTimestamp();
  }

  return embed;
}

module.exports = { buildInfoEmbed };
