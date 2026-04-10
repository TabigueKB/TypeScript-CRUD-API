import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import usersController from './users/users.controller';
import accountsController from './accounts/accounts.controller';
import employeesController from './employees/employees.controller';
import departmentsController from './departments/departments.controller';
import requestsController from './requests/requests.controller';
import authController from './auth/auth.controller';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersController);
app.use('/accounts', accountsController);
app.use('/employees', employeesController);
app.use('/departments', departmentsController);
app.use('/requests', requestsController);
app.use('/auth', authController);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
initialize()
  .then(() => {
    app.listen(PORT, () => 
    console.log(`✅ Server running on http://localhost:${PORT}`));
    console.log('✅ Login in Admin account to test: admin@example.com / admin123');
  })
  .catch((err) => { console.error('❌ Failed to initialize:', err); process.exit(1); });
