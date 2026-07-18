/**
 * Membangun kunci unik sesi berdasarkan ID guild dan ID pengguna.
 */
function buildSessionKey(guildId, userId) {
  return `${guildId}:${userId}`;
}

module.exports = { buildSessionKey };
