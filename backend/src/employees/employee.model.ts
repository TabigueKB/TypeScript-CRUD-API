import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface EmployeeAttributes {
  id: number;
  empId: string;
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
}
export interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> {}

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
  public empId!: string;
  public name!: string;
  public email!: string;
  public position!: string;
  public department!: string;
  public hireDate!: string;
}

export default function(sequelize: Sequelize): typeof Employee {
  Employee.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    empId: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    hireDate: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, modelName: 'Employee', tableName: 'employees', timestamps: false });
  return Employee;
}
