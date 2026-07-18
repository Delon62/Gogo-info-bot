require('dotenv').config();

const path = require('path');

// Variabel lingkungan yang wajib ada
const REQUIRED_ENV_VARS = ['DISCORD_TOKEN', 'CLIENT_ID'];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error(`[CONFIG] Variabel lingkungan tidak ditemukan: ${missing.join(', ')}`);
    console.error('[CONFIG] Isi variabel tersebut di file .env atau panel hosting Anda sebelum menjalankan bot.');
    process.exit(1);
  }
}

validateEnv();

// --- Validasi warna embed default ---
const HEX_COLOR_REGEX = /^#?[0-9A-Fa-f]{6}$/;
const FALLBACK_EMBED_COLOR = '#5865F2';

function resolveDefaultEmbedColor() {
  const raw = process.env.DEFAULT_EMBED_COLOR?.trim();
  if (!raw) return FALLBACK_EMBED_COLOR;
  if (!HEX_COLOR_REGEX.test(raw)) {
    console.warn(`[CONFIG] DEFAULT_EMBED_COLOR="${raw}" tidak valid (harus hex 6 digit, contoh: #5865F2). Menggunakan warna default.`);
    return FALLBACK_EMBED_COLOR;
  }
  return raw.startsWith('#') ? raw : `#${raw}`;
}

// --- Ekspor konfigurasi ---
module.exports = {
  token:               process.env.DISCORD_TOKEN,
  clientId:            process.env.CLIENT_ID,
  prefix:              process.env.PREFIX?.trim() || '!',
  botVersion:          '2.0.0',
  botName:             'GALAXI Info Bot',
  defaultEmbedColor:   resolveDefaultEmbedColor(),
  maxImageSizeMb:      Number(process.env.MAX_IMAGE_SIZE_MB) > 0 ? Number(process.env.MAX_IMAGE_SIZE_MB) : 8,
  imageUploadTimeoutMs: 60_000,
  databasePath:
    process.env.DATABASE_PATH?.trim() ||
    path.join(__dirname, 'data', 'database.sqlite'),
};
