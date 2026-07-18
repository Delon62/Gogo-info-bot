const { StringSelectMenuBuilder, ActionRowBuilder, RoleSelectMenuBuilder, MessageFlags } = require('discord.js');
const customIds             = require('../utils/customIds');
const sessionStore          = require('../database/sessionStore');
const { buildSessionKey }   = require('../utils/sessionKey');
const { finalizeAndSend }   = require('../handlers/sendFlow');

function buildMentionTypeRow() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customIds.MENTION_TYPE_SELECT)
    .setPlaceholder('Pilih jenis mention...')
    .addOptions(
      { label: 'Tidak ada mention',  value: 'none',      emoji: '🔕' },
      { label: '@everyone',          value: 'everyone',  emoji: '📢' },
      { label: '@here',              value: 'here',      emoji: '👥' },
      { label: 'Mention Role',       value: 'role',      emoji: '🏷️' },
    );
  return new ActionRowBuilder().addComponents(menu);
}

function buildRoleSelectRow() {
  const menu = new RoleSelectMenuBuilder()
    .setCustomId(customIds.ROLE_SELECT)
    .setPlaceholder('Pilih role...');
  return new ActionRowBuilder().addComponents(menu);
}

async function execute(interaction) {
  const key     = buildSessionKey(interaction.guildId, interaction.user.id);
  const session = sessionStore.getSession(key);
  if (!session) {
    await interaction.reply({
      content: '⚠️ Sesi tidak ditemukan. Mulai ulang dari panel.',
      flags:   MessageFlags.Ephemeral,
    });
    return;
  }

  const mentionType = interaction.values[0];
  session.mentionType = mentionType;
  sessionStore.setSession(key, session.guildId, session.userId, session);

  if (mentionType === 'role') {
    await interaction.reply({
      content:    '🏷️ Pilih role yang akan di-mention:',
      components: [buildRoleSelectRow()],
      flags:      MessageFlags.Ephemeral,
    });
    return;
  }

  await finalizeAndSend(interaction, session, key);
}

module.exports = { customId: customIds.MENTION_TYPE_SELECT, execute, buildMentionTypeRow, buildRoleSelectRow };
