const { Events, InteractionType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction, { commands, components }) {
    try {
      // Slash commands
      if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) {
          logger.warn('INTERACTION', `Slash command tidak ditemukan: ${interaction.commandName}`);
          return;
        }
        await command.execute(interaction);
        return;
      }

      // Tombol (buttons)
      if (interaction.isButton()) {
        const handler = components.buttons.get(interaction.customId);
        if (!handler) {
          logger.warn('INTERACTION', `Button handler tidak ditemukan: ${interaction.customId}`);
          return;
        }
        await handler.execute(interaction);
        return;
      }

      // Select menu (string, channel, role)
      if (interaction.isAnySelectMenu()) {
        const handler = components.menus.get(interaction.customId);
        if (!handler) {
          logger.warn('INTERACTION', `Menu handler tidak ditemukan: ${interaction.customId}`);
          return;
        }
        await handler.execute(interaction);
        return;
      }

      // Modal submit
      if (interaction.type === InteractionType.ModalSubmit) {
        const handler = components.modals.get(interaction.customId);
        if (!handler) {
          logger.warn('INTERACTION', `Modal handler tidak ditemukan: ${interaction.customId}`);
          return;
        }
        await handler.execute(interaction);
        return;
      }
    } catch (err) {
      logger.error('INTERACTION', `Error saat menangani interaksi: ${interaction.customId ?? interaction.commandName}`, err);
      const reply = { content: '❌ Terjadi kesalahan. Silakan coba lagi.', flags: 64 };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply).catch(() => {});
      } else {
        await interaction.reply(reply).catch(() => {});
      }
    }
  },
};
