const { PermissionFlagsBits } = require('discord.js');

function isAdministrator(member) {
  return Boolean(member && member.permissions && member.permissions.has(PermissionFlagsBits.Administrator));
}

function canUsePanel(member, allowedRoleId) {
  if (isAdministrator(member)) return true;
  if (allowedRoleId && member && member.roles && member.roles.cache.has(allowedRoleId)) {
    return true;
  }
  return false;
}

function isModerator(member, moderatorRoleId) {
  if (isAdministrator(member)) return true;
  if (moderatorRoleId && member && member.roles && member.roles.cache.has(moderatorRoleId)) {
    return true;
  }
  return false;
}

module.exports = { isAdministrator, canUsePanel, isModerator };
