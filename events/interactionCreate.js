const { Events, MessageFlags } = require('discord.js');
const logger = require('../utils/logger');

async function safeRespond(interaction, payload) {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  } catch (err) {
    logger.error('INTERACTION', 'Gagal mengirim respons error ke pengguna', err);
  }
}

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction, context) {
    const { commands, components } = context;

    const ageMs = Date.now() - interaction.createdTimestamp;
    logger.info(
      'INTERACTION',
      `Interaksi diterima (customId/command: ${interaction.customId || interaction.commandName}), usia saat diterima: ${ageMs}ms`,
    );

    try {
      if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) {
          await safeRespond(interaction, { content: '❌ Command tidak dikenali.', flags: MessageFlags.Ephemeral });
          return;
        }
        await command.execute(interaction);
        return;
      }

      if (interaction.isButton()) {
        const handler = components.buttons.get(interaction.customId);
        if (!handler) return;
        await handler.execute(interaction);
        return;
      }

      if (interaction.isStringSelectMenu() || interaction.isChannelSelectMenu() || interaction.isRoleSelectMenu()) {
        const handler = components.menus.get(interaction.customId);
        if (!handler) return;
        await handler.execute(interaction);
        return;
      }

      if (interaction.isModalSubmit()) {
        const handler = components.modals.get(interaction.customId);
        if (!handler) return;
        await handler.execute(interaction);
        return;
      }
    } catch (err) {
      logger.error(
        'INTERACTION',
        `Gagal menangani interaksi (customId/command: ${interaction.customId || interaction.commandName})`,
        err,
      );
      await safeRespond(interaction, {
        content: '❌ Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
