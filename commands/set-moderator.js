const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { setModeratorRole } = require('../database/guildConfig');
const logger = require('../utils/logger');

const data = new SlashCommandBuilder()
  .setName('set-moderator')
  .setDescription('Menetapkan role yang boleh menggunakan command moderasi seperti !clear.')
  .addRoleOption((option) =>
    option.setName('role').setDescription('Role yang diberi akses moderasi').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

async function execute(interaction) {
  const role = interaction.options.getRole('role');

  setModeratorRole(interaction.guildId, role.id);

  await interaction.reply({
    content: `✅ Role <@&${role.id}> sekarang bisa menggunakan command moderasi (contoh: \`!clear\`).`,
    flags: MessageFlags.Ephemeral,
  });

  logger.info(
    'SET_MODERATOR',
    `Role moderator diatur ke ${role.id} (${role.name}) di guild ${interaction.guildId}`,
  );
}

module.exports = { data, execute };
