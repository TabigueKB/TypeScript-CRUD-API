"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class RequestModel extends sequelize_1.Model {
}
exports.RequestModel = RequestModel;
function default_1(sequelize) {
    RequestModel.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        type: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        items: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        status: { type: sequelize_1.DataTypes.STRING, defaultValue: 'Pending' },
        date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        employeeEmail: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    }, { sequelize, modelName: 'Request', tableName: 'requests', timestamps: false });
    return RequestModel;
}
