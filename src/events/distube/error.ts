import logger from '#helpers/logger.js';
import { DisTubeEvent } from '#interfaces';
import { BaseGuildTextChannel } from 'discord.js';
import { Events } from 'distube';

export const event: DisTubeEvent = {
  name: Events.ERROR,
  async execute(channel: BaseGuildTextChannel, error: Error) {
    if (channel) await channel.send(`There was an error encountered: ${error.message}`);

    logger.error(error);
  },
};
