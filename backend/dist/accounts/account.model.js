"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class Account extends sequelize_1.Model {
}
exports.Account = Account;
function default_1(sequelize) {
    Account.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        lastname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
        passwordHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        role: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'User' },
        verified: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    }, {
        sequelize, modelName: 'Account', tableName: 'accounts', timestamps: false,
        defaultScope: { attributes: { exclude: ['passwordHash'] } },
        scopes: { withHash: { attributes: { include: ['passwordHash'] } } },
    });
    return Account;
}
