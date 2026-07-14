const db = require('./db');

const upsertPanelStmt = db.prepare(`
  INSERT INTO guild_configs (guild_id, panel_channel_id, panel_message_id, updated_at)
  VALUES (@guildId, @channelId, @messageId, datetime('now'))
  ON CONFLICT(guild_id) DO UPDATE SET
    panel_channel_id = @channelId,
    panel_message_id = @messageId,
    updated_at = datetime('now')
`);

const getConfigStmt = db.prepare('SELECT * FROM guild_configs WHERE guild_id = ?');

const setAllowedRoleStmt = db.prepare(`
  INSERT INTO guild_configs (guild_id, allowed_role_id, updated_at)
  VALUES (@guildId, @roleId, datetime('now'))
  ON CONFLICT(guild_id) DO UPDATE SET
    allowed_role_id = @roleId,
    updated_at = datetime('now')
`);

function getGuildConfig(guildId) {
  return getConfigStmt.get(guildId) || null;
}

function savePanel(guildId, channelId, messageId) {
  upsertPanelStmt.run({ guildId, channelId, messageId });
}

function setAllowedRole(guildId, roleId) {
  setAllowedRoleStmt.run({ guildId, roleId });
}

module.exports = { getGuildConfig, savePanel, setAllowedRole };
