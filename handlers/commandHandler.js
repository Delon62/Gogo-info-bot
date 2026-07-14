const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const logger = require('../utils/logger');

function loadCommands() {
  const commands = new Collection();
  const commandsDir = path.join(__dirname, '..', 'commands');
  const files = fs.readdirSync(commandsDir).filter((file) => file.endsWith('.js'));

  for (const file of files) {
    const command = require(path.join(commandsDir, file));
    if (!command?.data || !command?.execute) {
      logger.warn('COMMAND_HANDLER', `File ${file} dilewati karena tidak memiliki 'data' atau 'execute'.`);
      continue;
    }
    commands.set(command.data.name, command);
  }

  logger.info('COMMAND_HANDLER', `${commands.size} slash command dimuat.`);
  return commands;
}

module.exports = { loadCommands };
