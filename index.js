const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config  = require('./config');
const logger  = require('./utils/logger');
const { loadCommands }    = require('./handlers/commandHandler');
const { loadComponents }  = require('./handlers/componentHandler');
const { loadEvents }      = require('./handlers/eventHandler');

// Inisialisasi database lebih awal agar tabel tersedia sebelum event diterima
require('./database/db');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

const commands   = loadCommands();
const components = loadComponents();

loadEvents(client, { commands, components });

// Tangkap error global agar bot tidak langsung mati
process.on('unhandledRejection', (reason) => {
  logger.error('PROCESS', 'Unhandled promise rejection', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('PROCESS', 'Uncaught exception', err);
});

client.login(config.token).catch((err) => {
  logger.error('LOGIN', 'Gagal login ke Discord. Periksa DISCORD_TOKEN Anda.', err);
  process.exit(1);
});
