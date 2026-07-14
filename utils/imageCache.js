// In-memory cache for images uploaded during the announcement builder flow.
// Only holds data for the short lifetime of an active session (max ~30 minutes
// as a safety net); permanent session fields are persisted in SQLite separately.

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map();

function setImage(key, buffer, filename) {
  cache.set(key, { buffer, filename, cachedAt: Date.now() });
}

function getImage(key) {
  return cache.get(key) || null;
}

function clearImage(key) {
  cache.delete(key);
}

function cleanupExpired() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.cachedAt > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}

setInterval(cleanupExpired, 10 * 60 * 1000);

module.exports = { setImage, getImage, clearImage };
