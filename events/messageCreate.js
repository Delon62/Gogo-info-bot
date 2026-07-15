const { Events, PermissionFlagsBits } = require('discord.js');
const config = require('../config');
const { buildHelpEmbed } = require('../embeds/helpEmbed');
const { getGuildConfig } = require('../database/guildConfig');
const { isModerator } = require('../utils/permissions');
const logger = require('../utils/logger');

const MAX_CLEAR_AMOUNT = 1000;
const BULK_DELETE_BATCH_SIZE = 100;

async function handleHelp(message) {
  try {
    await message.reply({ embeds: [buildHelpEmbed()] });
  } catch (err) {
    logger.error('MESSAGE_CREATE', 'Gagal mengirim pesan bantuan', err);
  }
}

async function replyTemporary(message, content) {
  try {
    const reply = await message.reply({ content });
    setTimeout(() => {
      reply.delete().catch(() => {});
    }, 5_000);
  } catch (err) {
    logger.error('MESSAGE_CREATE', 'Gagal mengirim balasan sementara', err);
  }
}

async function handleClear(message, args) {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    await replyTemporary(message, '❌ Bot tidak memiliki izin "Manage Messages" di channel ini.');
    return;
  }

  const guildConfig = getGuildConfig(message.guildId);
  const moderatorRoleId = guildConfig ? guildConfig.moderator_role_id : null;

  if (!isModerator(message.member, moderatorRoleId)) {
    await replyTemporary(
      message,
      '❌ Anda tidak memiliki izin untuk menggunakan command ini. Hubungi Administrator untuk diberi akses lewat `/set-moderator`.',
    );
    return;
  }

  const amount = Number(args[0]);
  if (!Number.isInteger(amount) || amount < 1 || amount > MAX_CLEAR_AMOUNT) {
    await replyTemporary(
      message,
      `❌ Jumlah tidak valid. Gunakan \`${config.prefix}clear <jumlah>\` dengan jumlah antara 1-${MAX_CLEAR_AMOUNT}.`,
    );
    return;
  }

  try {
    await message.delete().catch(() => {});

    let remaining = amount;
    let totalDeleted = 0;
    while (remaining > 0) {
      const batchSize = Math.min(remaining, BULK_DELETE_BATCH_SIZE);
      const deleted = await message.channel.bulkDelete(batchSize, true);
      totalDeleted += deleted.size;
      remaining -= batchSize;
      if (deleted.size < batchSize) break; // Tidak ada lagi pesan yang bisa dihapus (mis. lebih tua dari 14 hari)
    }

    const notice = await message.channel.send(
      `🧹 Berhasil menghapus ${totalDeleted} pesan.` +
        (totalDeleted < amount ? ' (Beberapa pesan lebih tua dari 14 hari sehingga tidak bisa dihapus otomatis.)' : ''),
    );
    setTimeout(() => {
      notice.delete().catch(() => {});
    }, 5_000);

    logger.info(
      'CLEAR',
      `${totalDeleted} pesan dihapus oleh ${message.author.tag} di guild ${message.guildId}`,
    );
  } catch (err) {
    logger.error('CLEAR', 'Gagal menghapus pesan', err);
    await message.channel
      .send('❌ Terjadi kesalahan saat menghapus pesan.')
      .catch(() => {});
  }
}

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();
    if (!content.startsWith(config.prefix)) return;

    const [rawCommand, ...args] = content.slice(config.prefix.length).trim().split(/\s+/);
    const commandName = rawCommand.toLowerCase();

    if (commandName === 'help') {
      await handleHelp(message);
      return;
    }

    if (commandName === 'clear') {
      await handleClear(message, args);
    }
  },
};
