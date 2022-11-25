import { ClientEvent } from '#interfaces';
import { Events, Message } from 'discord.js';
import { addBalance } from '#helpers/addBalance.js';

export const event: ClientEvent = {
  name: Events.MessageCreate,
  async execute(client, message: Message) {
    if (message.author.bot) return;

    await addBalance(client, message.author.id, 1);
  },
};
