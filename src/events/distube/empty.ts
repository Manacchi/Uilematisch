import { DisTubeEvent } from '#interfaces';
import { Events, Queue } from 'distube';

export const event: DisTubeEvent = {
  name: Events.EMPTY,
  async execute(queue: Queue) {
    await queue.textChannel.send(`<#${queue.voiceChannel.id}> is empty, leaving the voice channel.`);
  },
};
