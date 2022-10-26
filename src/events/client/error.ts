import logger from '#helpers/logger.js';
import { ClientEvent } from '#interfaces';
import { Events } from 'discord.js';

export const event: ClientEvent = {
  name: Events.Error,
  execute(_client, error: Error) {
    logger.error(error);
  },
};
