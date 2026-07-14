const { AttachmentBuilder } = require('discord.js');
const sessionStore = require('../database/sessionStore');
const imageCache = require('../utils/imageCache');
const { buildInfoEmbed } = require('../embeds/infoEmbed');
const logger = require('../utils/logger');

function resolveMentionContent(session) {
  if (session.mentionType === 'everyone') return '@everyone';
  if (session.mentionType === 'here') return '@here';
  if (session.mentionType === 'role' && session.mentionRoleId) return `<@&${session.mentionRoleId}>`;
  return null;
}

function resolveAllowedMentions(session) {
  if (session.mentionType === 'everyone' || session.mentionType === 'here') {
    return { parse: ['everyone'] };
  }
  if (session.mentionType === 'role' && session.mentionRoleId) {
    return { roles: [session.mentionRoleId] };
  }
  return { parse: [] };
}

async function finalizeAndSend(interaction, session, key) {
  try {
    const channel = await interaction.guild.channels.fetch(session.targetChannelId).catch(() => null);
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ content: '❌ Channel tujuan tidak valid atau tidak ditemukan.', flags: 64 });
      return;
    }

    const embed = buildInfoEmbed(session);
    const files = [];
    const cached = imageCache.getImage(key);
    if (cached) {
      files.push(new AttachmentBuilder(cached.buffer, { name: cached.filename }));
    }

    const mentionContent = resolveMentionContent(session);

    await channel.send({
      content: mentionContent || undefined,
      embeds: [embed],
      files,
      allowedMentions: resolveAllowedMentions(session),
    });

    sessionStore.deleteSession(key);
    imageCache.clearImage(key);

    await interaction.reply({
      content: `✅ Pengumuman berhasil dikirim ke <#${session.targetChannelId}>.`,
      flags: 64,
    });
  } catch (err) {
    logger.error('SEND_FLOW', 'Gagal mengirim pengumuman', err);
    await interaction.reply({
      content: '❌ Terjadi kesalahan saat mengirim pengumuman. Silakan coba lagi.',
      flags: 64,
    });
  }
}

module.exports = { finalizeAndSend, resolveMentionContent, resolveAllowedMentions };
