import logger from '#helpers/logger.js';
import { ClientEvent } from '#interfaces';
import { Events } from 'discord.js';

export const event: ClientEvent = {
  name: Events.Warn,
  execute(_client, message: string) {
    logger.warn(`${message}`);
  },
};
