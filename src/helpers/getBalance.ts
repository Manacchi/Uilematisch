import { ExtendedClient } from '#structures/Client.js';

/**
 * Gets the balance of a given user's ID.
 *
 * @param {ExtendedClient} client The bot's client instance.
 * @param {string} id The user's ID.
 * @returns {number} The user's balance.
 */
export function getBalance(client: ExtendedClient, id: string): number {
  const user = client.currency.get(id);

  return user
    ? user.balance
    : 0;
}
