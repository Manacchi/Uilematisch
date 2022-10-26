import { ExtendedClient } from '#structures/Client.js';
import { ClientEvents } from 'discord.js';
import { DisTubeEvents } from 'distube';

export interface ClientEvent {
  name: keyof ClientEvents;
  once?: boolean;
  execute(client: ExtendedClient, ...args: unknown[]): void | Promise<void>;
}

export interface DisTubeEvent {
  name: keyof DisTubeEvents;
  execute(...args: unknown[]): void | Promise<void>;
}
