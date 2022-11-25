import { UserItemModel } from '#interfaces';
import { DataTypes, ModelStatic, Sequelize } from 'sequelize';

/**
 * Defines the User Item Sequelize model.
 *
 * @param {Sequelize} sequelize The Sequelize instance.
 * @returns {ModelStatic<UserItemModel>} The User Items model.
 */
export default function(sequelize: Sequelize): ModelStatic<UserItemModel> {
  return sequelize.define<UserItemModel>(
    'user_item',
    {
      user_id: DataTypes.STRING,
      item_id: DataTypes.INTEGER,
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'default': 0,
      },
    },
    { timestamps: false },
  );
}
