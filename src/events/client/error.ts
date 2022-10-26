import { ClientEvent } from '#interfaces';
import chalk from 'chalk';
import { Events } from 'discord.js';

export const event: ClientEvent = {
  name: Events.Error,
  execute(_client, error: Error) {
    console.error(`${chalk.red('ERROR')}:`, error);
  },
};
