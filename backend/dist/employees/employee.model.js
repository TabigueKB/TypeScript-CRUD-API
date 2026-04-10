"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class Employee extends sequelize_1.Model {
}
exports.Employee = Employee;
function default_1(sequelize) {
    Employee.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        empId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        position: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        department: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        hireDate: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    }, { sequelize, modelName: 'Employee', tableName: 'employees', timestamps: false });
    return Employee;
}
