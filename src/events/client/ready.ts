import { ClientEvent } from '#interfaces';
import { Users } from '#models';
import { ExtendedClient } from '#structures/Client.js';
import chalk from 'chalk';
import { ActivityType, Events } from 'discord.js';

export const event: ClientEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(_client, client: ExtendedClient) {
    const storedbalances = await Users.findAll();

    storedbalances.forEach((balance) => client.currency.set(balance.user_id, balance));

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
