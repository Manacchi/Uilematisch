import { ClientEvent } from '#interfaces';
import { ExtendedClient } from '#structures/Client.js';
import chalk from 'chalk';
import { ActivityType, Events } from 'discord.js';

export const event: ClientEvent = {
  name: Events.ClientReady,
  once: true,
  execute(_client, client: ExtendedClient) {
    client.user.setPresence({
      activities: [{
        name: 'your commands',
        type: ActivityType.Listening,
      }],
      status: 'online',
    });

    console.info(`${chalk.blue('INFO')}: Ready! Logged in as ${client.user.tag}`);
  },
};
