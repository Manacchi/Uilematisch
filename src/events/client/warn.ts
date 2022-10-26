import { ClientEvent } from '#interfaces';
import chalk from 'chalk';
import { Events } from 'discord.js';

export const event: ClientEvent = {
  name: Events.Warn,
  execute(_client, message: string) {
    console.warn(`${chalk.yellow('WARN')}: ${message}`);
  },
};
