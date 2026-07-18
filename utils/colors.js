/**
 * Daftar nama warna yang dikenali dan fungsi resolusi warna embed.
 */
const NAMED_COLORS = {
  biru:    '#5865F2',
  merah:   '#ED4245',
  hijau:   '#57F287',
  kuning:  '#FEE75C',
  ungu:    '#9B59B6',
  oranye:  '#E67E22',
  hitam:   '#23272A',
  putih:   '#FFFFFF',
  abu:     '#99AAB5',
};

const HEX_REGEX = /^#?[0-9A-Fa-f]{6}$/;

/**
 * Mengembalikan kode warna hex berdasarkan input pengguna.
 * Mendukung nama warna, hex, 'random', dan fallback.
 */
function resolveColor(input, fallback) {
  if (!input || !input.trim()) return fallback;

  const trimmed = input.trim().toLowerCase();

  if (trimmed === 'random') {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
  }

  if (NAMED_COLORS[trimmed]) return NAMED_COLORS[trimmed];

  if (HEX_REGEX.test(input.trim())) {
    return input.trim().startsWith('#') ? input.trim() : `#${input.trim()}`;
  }

  return null; // Input tidak dikenali
}

/**
 * Teks opsi warna untuk ditampilkan di embed bantuan.
 */
function colorChoicesText() {
  return `${Object.keys(NAMED_COLORS).join(', ')}, random, atau kode hex (contoh: #5865F2)`;
}

module.exports = { NAMED_COLORS, resolveColor, colorChoicesText };
