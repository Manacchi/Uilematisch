import config from '#config';
import logger from '#helpers/logger.js';
import { ExtendedClient } from '#structures/Client.js';
import { GatewayIntentBits } from 'discord.js';

const client = new ExtendedClient({ intents: [
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates,
] });

const register = process.argv.includes('--register') || process.argv.includes('-r');

void (async (): Promise<void> => {
  try {
    await client.loadCommands(register);

    await client.loadComponents();

    await client.loadEvents();

    await client.login(config.token);
  }
  catch (error) {
    logger.fatal(error);
  }
})();
