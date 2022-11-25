/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CurrencyShopModel, UsersModel } from '#interfaces';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const Users = (await import('./Users.js')).default(sequelize);
const CurrencyShop = (await import('./CurrencyShop.js')).default(sequelize);
const UserItems = (await import('./UserItems.js')).default(sequelize);

UserItems.belongsTo(CurrencyShop, {
  foreignKey: 'item_id',
  as: 'item',
});

Reflect.defineProperty(Users.prototype, 'addItem', { value: async (user: UsersModel, item: CurrencyShopModel) => {
  const userItem = await UserItems.findOne({ where: {
    user_id: user.user_id,
    item_id: item.id,
  } });

  if (userItem) {
    userItem.amount += 1;

    return userItem.save();
  }

  return UserItems.create({
    user_id: user.user_id,
    item_id: item.id,
    amount: 1,
  });
} });

Reflect.defineProperty(Users.prototype, 'getItems', { value: async (user: UsersModel) => {
  return UserItems.findAll({
    where: { user_id: user.user_id },
    include: ['item'],
  });
} });

export { Users, CurrencyShop, UserItems };
