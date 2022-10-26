import logger from '#helpers/logger.js';
import { ClientEvent } from '#interfaces';
import { ExtendedClient } from '#structures/Client.js';
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

    logger.info(`Ready! Logged in as ${client.user.tag}`);
  },
};
