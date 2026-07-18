const { Events, PermissionFlagsBits } = require('discord.js');
const config             = require('../config');
const logger             = require('../utils/logger');
const { buildHelpEmbed } = require('../embeds/helpEmbed');
const { isModerator }    = require('../utils/permissions');
const { getGuildConfig } = require('../database/guildConfig');

const BULK_DELETE_BATCH_SIZE = 100;

// --- Handler !help ---

async function handleHelp(message) {
  await message.channel.send({ embeds: [buildHelpEmbed()] }).catch(() => {});
}

// --- Handler !clear ---

async function handleClear(message, args) {
  const amount = parseInt(args[0], 10);

  if (isNaN(amount) || amount < 1) {
    await message.channel.send('⚠️ Gunakan: `!clear <jumlah>` (contoh: `!clear 10`)').catch(() => {});
    return;
  }

  const guildConfig = getGuildConfig(message.guildId);
  if (!isModerator(message.member, guildConfig?.moderator_role_id)) {
    await message.channel.send('❌ Anda tidak memiliki izin untuk menghapus pesan.').catch(() => {});
    return;
  }

  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
    await message.channel.send('❌ Bot tidak memiliki izin `Manage Messages` di channel ini.').catch(() => {});
    return;
  }

  try {
    // Hapus pesan perintah terlebih dahulu
    await message.delete().catch(() => {});

    let remaining     = amount;
    let totalDeleted  = 0;

    while (remaining > 0) {
      const batchSize = Math.min(remaining, BULK_DELETE_BATCH_SIZE);
      const deleted   = await message.channel.bulkDelete(batchSize, true);
      totalDeleted   += deleted.size;
      remaining      -= batchSize;
      if (deleted.size < batchSize) break; // Tidak ada lagi pesan yang bisa dihapus
    }

    const notice = await message.channel.send(
      `🧹 Berhasil menghapus **${totalDeleted}** pesan.` +
      (totalDeleted < amount
        ? ' *(Beberapa pesan lebih tua dari 14 hari sehingga tidak bisa dihapus otomatis.)*'
        : ''),
    );

    setTimeout(() => notice.delete().catch(() => {}), 5_000);

    logger.info('CLEAR', `${totalDeleted} pesan dihapus oleh ${message.author.tag} di guild ${message.guildId}`);
  } catch (err) {
    logger.error('CLEAR', 'Gagal menghapus pesan', err);
    await message.channel.send('❌ Terjadi kesalahan saat menghapus pesan.').catch(() => {});
  }
}

// --- Event handler ---

module.exports = {
  name: Events.MessageCreate,
  once: false,

  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();
    if (!content.startsWith(config.prefix)) return;

    const [rawCommand, ...args] = content.slice(config.prefix.length).trim().split(/\s+/);
    const commandName = rawCommand.toLowerCase();

    if (commandName === 'help')  return handleHelp(message);
    if (commandName === 'clear') return handleClear(message, args);
  },
};
