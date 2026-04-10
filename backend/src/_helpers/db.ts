import config from '../../config.json';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';

export interface Database {
  User: any;
  Account: any;
  Employee: any;
  Department: any;
  Request: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();

  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql', logging: false });

  const { default: userModel } = await import('../users/user.model');
  const { default: accountModel } = await import('../accounts/account.model');
  const { default: employeeModel } = await import('../employees/employee.model');
  const { default: departmentModel } = await import('../departments/department.model');
  const { default: requestModel } = await import('../requests/request.model');

  db.User = userModel(sequelize);
  db.Account = accountModel(sequelize);
  db.Employee = employeeModel(sequelize);
  db.Department = departmentModel(sequelize);
  db.Request = requestModel(sequelize);

  await sequelize.sync({ alter: true });

  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const [admin, created] = await db.Account.findOrCreate({
    where: { email: adminEmail },
    defaults: {
      firstname: 'Admin',
      lastname: 'User',
      email: adminEmail,
      passwordHash: adminHash,
      role: 'Admin',
      verified: true,
    },
  });

  if (!created) {
    await admin.update({ role: 'Admin', verified: true, passwordHash: adminHash });
  }

  console.log('✅ Database initialized');
}
