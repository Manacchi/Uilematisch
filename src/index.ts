import config from '#config';
import { ExtendedClient } from '#structures/Client.js';
import chalk from 'chalk';
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
    console.error(`${chalk.bgRedBright('FATAL')}:`, error);
  }
})();
