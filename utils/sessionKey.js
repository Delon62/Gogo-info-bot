function buildSessionKey(guildId, userId) {
  return `${guildId}:${userId}`;
}

module.exports = { buildSessionKey };
