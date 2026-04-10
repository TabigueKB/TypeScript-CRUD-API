import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface AccountAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: string;
  verified: boolean;
}
export interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: string;
  public verified!: boolean;
}

export default function(sequelize: Sequelize): typeof Account {
  Account.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'User' },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize, modelName: 'Account', tableName: 'accounts', timestamps: false,
    defaultScope: { attributes: { exclude: ['passwordHash'] } },
    scopes: { withHash: { attributes: { include: ['passwordHash'] } } },
  });
  return Account;
}
