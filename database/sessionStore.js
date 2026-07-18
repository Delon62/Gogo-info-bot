const db = require('./db');

// --- Prepared statements ---

const upsertStmt = db.prepare(`
  INSERT INTO sessions (session_key, guild_id, user_id, data, updated_at)
  VALUES (@key, @guildId, @userId, @data, datetime('now'))
  ON CONFLICT(session_key) DO UPDATE SET
    data       = @data,
    updated_at = datetime('now')
`);

const getStmt    = db.prepare('SELECT data FROM sessions WHERE session_key = ?');
const deleteStmt = db.prepare('DELETE FROM sessions WHERE session_key = ?');

// --- Fungsi publik ---

function getSession(key) {
  const row = getStmt.get(key);
  if (!row) return null;
  try {
    return JSON.parse(row.data);
  } catch {
    return null;
  }
}

function setSession(key, guildId, userId, sessionData) {
  upsertStmt.run({ key, guildId, userId, data: JSON.stringify(sessionData) });
}

function deleteSession(key) {
  deleteStmt.run(key);
}

module.exports = { getSession, setSession, deleteSession };
