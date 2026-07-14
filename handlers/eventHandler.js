const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

function loadEvents(client, extraContext) {
  const eventsDir = path.join(__dirname, '..', 'events');
  const files = fs.readdirSync(eventsDir).filter((file) => file.endsWith('.js'));

  for (const file of files) {
    const event = require(path.join(eventsDir, file));
    if (!event?.name || !event?.execute) {
      logger.warn('EVENT_HANDLER', `File events/${file} dilewati karena tidak memiliki 'name' atau 'execute'.`);
      continue;
    }
    const listener = (...args) => event.execute(...args, extraContext);
    if (event.once) {
      client.once(event.name, listener);
    } else {
      client.on(event.name, listener);
    }
  }

  logger.info('EVENT_HANDLER', "Event handler dimuat dari folder 'events'.");
}

module.exports = { loadEvents };
