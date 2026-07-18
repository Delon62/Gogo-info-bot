const { PermissionFlagsBits } = require('discord.js');

/**
 * Memeriksa apakah member adalah Administrator.
 */
function isAdministrator(member) {
  return Boolean(member?.permissions?.has(PermissionFlagsBits.Administrator));
}

/**
 * Memeriksa apakah member boleh menggunakan panel (Admin atau role yang diizinkan).
 */
function canUsePanel(member, allowedRoleId) {
  if (isAdministrator(member)) return true;
  if (allowedRoleId && member?.roles?.cache.has(allowedRoleId)) return true;
  return false;
}

/**
 * Memeriksa apakah member boleh menggunakan command moderasi.
 */
function isModerator(member, moderatorRoleId) {
  if (isAdministrator(member)) return true;
  if (moderatorRoleId && member?.roles?.cache.has(moderatorRoleId)) return true;
  return false;
}

module.exports = { isAdministrator, canUsePanel, isModerator };
