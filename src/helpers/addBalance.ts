import { UsersModel } from '#interfaces';
import { Users } from '#models';
import { ExtendedClient } from '#structures/Client.js';

/**
 * Adds balance to a given user's ID.
 *
 * @param {ExtendedClient} client The bot's client instance.
 * @param {string} id The user's ID.
 * @param {number} amount The amount of balance to add.
 * @returns {Promise<UsersModel>} The user's Model instance.
 */
export async function addBalance(client: ExtendedClient, id: string, amount: number): Promise<UsersModel> {
  const user = client.currency.get(id);

  if (user) {
    user.balance += Number(amount);

    return user.save();
  }

  const newUser = await Users.create({
    user_id: id,
    balance: amount,
  });

  client.currency.set(id, newUser);

  return newUser;
}
