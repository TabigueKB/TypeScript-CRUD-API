import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface RequestAttributes {
  id: number;
  type: string;
  items: string;
  status: string;
  date: string;
  employeeEmail: string;
}
export interface RequestCreationAttributes extends Optional<RequestAttributes, 'id' | 'status' | 'date'> {}

export class RequestModel extends Model<RequestAttributes, RequestCreationAttributes> implements RequestAttributes {
  public id!: number;
  public type!: string;
  public items!: string;
  public status!: string;
  public date!: string;
  public employeeEmail!: string;
}

export default function(sequelize: Sequelize): typeof RequestModel {
  RequestModel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false },
    items: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    date: { type: DataTypes.STRING, allowNull: false },
    employeeEmail: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, modelName: 'Request', tableName: 'requests', timestamps: false });
  return RequestModel;
}
