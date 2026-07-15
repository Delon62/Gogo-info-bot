const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const config = require('../config');
const logger = require('../utils/logger');

const dataDir = path.dirname(config.databasePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(config.databasePath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS guild_configs (
    guild_id TEXT PRIMARY KEY,
    panel_channel_id TEXT,
    panel_message_id TEXT,
    allowed_role_id TEXT,
    moderator_role_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    session_key TEXT PRIMARY KEY,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Migrasi ringan untuk database yang dibuat sebelum kolom moderator_role_id ada.
const existingColumns = db.prepare("PRAGMA table_info(guild_configs)").all().map((col) => col.name);
if (!existingColumns.includes('moderator_role_id')) {
  db.exec('ALTER TABLE guild_configs ADD COLUMN moderator_role_id TEXT');
  logger.info('DATABASE', "Kolom 'moderator_role_id' ditambahkan ke tabel guild_configs.");
}

logger.info('DATABASE', `SQLite database siap di ${config.databasePath}`);

module.exports = db;
