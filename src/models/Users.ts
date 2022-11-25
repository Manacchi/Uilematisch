import { UsersModel } from '#interfaces';
import { DataTypes, ModelStatic, Sequelize } from 'sequelize';

/**
 * Defines the Users Sequelize model.
 *
 * @param {Sequelize} sequelize The Sequelize instance.
 * @returns {ModelStatic<UsersModel>} The Users model.
 */
export default function(sequelize: Sequelize): ModelStatic<UsersModel> {
  return sequelize.define<UsersModel>(
    'users',
    {
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    { timestamps: false },
  );
}
