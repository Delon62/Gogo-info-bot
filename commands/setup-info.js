const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
} = require('discord.js');
const { buildPanelEmbed, buildPanelComponents } = require('../embeds/panelEmbed');
const { getGuildConfig, savePanel }             = require('../database/guildConfig');
const logger                                    = require('../utils/logger');

const data = new SlashCommandBuilder()
  .setName('setup-info')
  .setDescription('Membuat atau memperbarui Panel Info Center di channel ini.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

async function execute(interaction) {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) {
    await interaction.reply({
      content: '❌ Command ini hanya bisa digunakan di channel teks server.',
      flags:   MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const guildConfig = getGuildConfig(interaction.guildId);
  const embed       = buildPanelEmbed();
  const components  = buildPanelComponents();

  // Coba perbarui panel lama jika ada
  let existingMessage = null;
  if (guildConfig?.panel_channel_id && guildConfig?.panel_message_id) {
    try {
      const panelChannel = await interaction.guild.channels.fetch(guildConfig.panel_channel_id);
      if (panelChannel?.isTextBased()) {
        existingMessage = await panelChannel.messages.fetch(guildConfig.panel_message_id);
      }
    } catch {
      existingMessage = null;
    }
  }

  if (existingMessage) {
    await existingMessage.edit({ embeds: [embed], components });
    savePanel(interaction.guildId, existingMessage.channelId, existingMessage.id);
    await interaction.editReply(`✅ Panel Info Center diperbarui di <#${existingMessage.channelId}>.`);
    logger.info('SETUP_INFO', `Panel diperbarui di guild ${interaction.guildId}`);
    return;
  }

  const sentMessage = await interaction.channel.send({ embeds: [embed], components });
  savePanel(interaction.guildId, sentMessage.channelId, sentMessage.id);
  await interaction.editReply('✅ Panel Info Center berhasil dibuat di channel ini.');
  logger.info('SETUP_INFO', `Panel dibuat di guild ${interaction.guildId}`);
}

module.exports = { data, execute };
