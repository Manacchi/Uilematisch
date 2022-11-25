import { CurrencyShopModel } from '#interfaces';
import { DataTypes, ModelStatic, Sequelize } from 'sequelize';

/**
 * Defines the Currency Shop Sequelize model.
 *
 * @param {Sequelize} sequelize The Sequelize instance.
 * @returns {ModelStatic<CurrencyShopModel>} The Currency Shop model.
 */
export default function(sequelize: Sequelize): ModelStatic<CurrencyShopModel> {
  return sequelize.define<CurrencyShopModel>(
    'currency_shop',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false },
  );
}
