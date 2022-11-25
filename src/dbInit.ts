import chalk from 'chalk';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const CurrencyShop = (await import('./models/CurrencyShop.js')).default(sequelize);
(await import('./models/Users.js')).default(sequelize);
(await import('./models/UserItems.js')).default(sequelize);

const alter = process.argv.includes('--alter') || process.argv.includes('-a');

void (async (): Promise<void> => {
  try {
    await sequelize.sync({ alter });

    const shop = [
      CurrencyShop.upsert({
        name: 'Tea',
        cost: 1,
      }),
      CurrencyShop.upsert({
        name: 'Coffee',
        cost: 2,
      }),
      CurrencyShop.upsert({
        name: 'Cake',
        cost: 5,
      }),
    ];

    await Promise.all(shop);

    console.log(`${chalk.green('SUCCESS')}: Database synced!`);

    await sequelize.close();
  }
  catch (error) {
    console.error(`${chalk.red('ERROR')}:`, error);
  }
})();
