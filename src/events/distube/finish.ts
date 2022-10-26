import { DisTubeEvent } from '#interfaces';
import { Events, Queue } from 'distube';

export const event: DisTubeEvent = {
  name: Events.FINISH,
  async execute(queue: Queue) {
    await queue.textChannel.send('No more songs left in the queue.');
  },
};
