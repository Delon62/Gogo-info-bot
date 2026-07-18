/**
 * Cache in-memory untuk gambar yang di-upload selama proses pembuatan informasi.
 * Data otomatis dibersihkan setelah 30 menit (TTL) sebagai pengaman.
 */

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 menit
const cache = new Map();

function setImage(key, buffer, filename) {
  cache.set(key, { buffer, filename, cachedAt: Date.now() });
}

function getImage(key) {
  return cache.get(key) ?? null;
}

function clearImage(key) {
  cache.delete(key);
}

/** Membersihkan entri yang sudah kedaluwarsa dari cache. */
function cleanupExpired() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.cachedAt > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}

// Jalankan pembersihan setiap 10 menit
setInterval(cleanupExpired, 10 * 60 * 1000);

module.exports = { setImage, getImage, clearImage };
