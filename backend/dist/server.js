"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./_middleware/errorHandler");
const db_1 = require("./_helpers/db");
const users_controller_1 = __importDefault(require("./users/users.controller"));
const accounts_controller_1 = __importDefault(require("./accounts/accounts.controller"));
const employees_controller_1 = __importDefault(require("./employees/employees.controller"));
const departments_controller_1 = __importDefault(require("./departments/departments.controller"));
const requests_controller_1 = __importDefault(require("./requests/requests.controller"));
const auth_controller_1 = __importDefault(require("./auth/auth.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use('/users', users_controller_1.default);
app.use('/accounts', accounts_controller_1.default);
app.use('/employees', employees_controller_1.default);
app.use('/departments', departments_controller_1.default);
app.use('/requests', requests_controller_1.default);
app.use('/auth', auth_controller_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
(0, db_1.initialize)()
    .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
})
    .catch((err) => { console.error('❌ Failed to initialize:', err); process.exit(1); });
