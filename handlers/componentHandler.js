const fs     = require('fs');
const path   = require('path');
const { Collection } = require('discord.js');
const logger = require('../utils/logger');

function loadComponentDir(dirName) {
  const registry = new Collection();
  const dirPath  = path.join(__dirname, '..', dirName);
  const files    = fs.readdirSync(dirPath).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const component = require(path.join(dirPath, file));
    if (!component?.customId || !component?.execute) {
      logger.warn('COMPONENT_HANDLER', `File ${dirName}/${file} dilewati — tidak memiliki 'customId' atau 'execute'.`);
      continue;
    }
    registry.set(component.customId, component);
  }

  logger.info('COMPONENT_HANDLER', `${registry.size} handler dimuat dari '${dirName}'.`);
  return registry;
}

function loadComponents() {
  return {
    buttons: loadComponentDir('buttons'),
    menus:   loadComponentDir('menus'),
    modals:  loadComponentDir('modals'),
  };
}

module.exports = { loadComponents };
