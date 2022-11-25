import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface CurrencyShopModel extends Model<InferAttributes<CurrencyShopModel>, InferCreationAttributes<CurrencyShopModel>> {
  id: CreationOptional<number>;
  name: string;
  cost: number;
}

export interface UserItemModel extends Model<InferAttributes<UserItemModel>, InferCreationAttributes<UserItemModel>> {
  id: CreationOptional<number>;
  user_id: string;
  item_id: number;
  amount: number;
  item?: CreationOptional<CurrencyShopModel>;
}

export interface UsersModel extends Model<InferAttributes<UsersModel>, InferCreationAttributes<UsersModel>> {
  user_id: string;
  balance: number;
  addItem?(user: this, item: CurrencyShopModel): Promise<UserItemModel>;
  getItems?(user: this): Promise<UserItemModel[]>;
}
