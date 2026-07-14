const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const customIds = require('../utils/customIds');
const sessionStore = require('../database/sessionStore');
const { buildSessionKey } = require('../utils/sessionKey');
const { buildMainModal } = require('../modals/infoModalMain');

const CATEGORIES = [
  { value: 'informasi', label: 'Informasi', emoji: '📢' },
  { value: 'event', label: 'Event', emoji: '🎉' },
  { value: 'lspd', label: 'LSPD', emoji: '👮' },
  { value: 'ems', label: 'EMS', emoji: '🚑' },
  { value: 'recruitment', label: 'Recruitment', emoji: '📋' },
  { value: 'peraturan', label: 'Peraturan', emoji: '📖' },
  { value: 'custom', label: 'Custom', emoji: '⚙️' },
];

function buildCategoryRow() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customIds.CATEGORY_SELECT)
    .setPlaceholder('Pilih kategori...')
    .addOptions(
      CATEGORIES.map((category) => ({
        label: category.label,
        value: category.value,
        emoji: category.emoji,
      })),
    );
  return new ActionRowBuilder().addComponents(menu);
}

async function execute(interaction) {
  const chosen = CATEGORIES.find((category) => category.value === interaction.values[0]);
  const key = buildSessionKey(interaction.guildId, interaction.user.id);
  let session = sessionStore.getSession(key);
  if (!session) {
    session = { guildId: interaction.guildId, userId: interaction.user.id, fields: [], timestamp: false };
  }
  session.category = chosen;
  sessionStore.setSession(key, session.guildId, session.userId, session);

  await interaction.showModal(buildMainModal(session));
}

module.exports = { customId: customIds.CATEGORY_SELECT, buildCategoryRow, execute, CATEGORIES };
