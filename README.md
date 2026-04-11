# TypeScript CRUD API — Full-Stack App

A full-stack application with a **Node.js + TypeScript + Express** backend and a **plain HTML/CSS/JS** frontend. Uses **MySQL** (via Sequelize) for persistence and supports role-based access control (Admin / User).

## Project Structure

```
fullstack-app/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Entry point
│   │   ├── _helpers/
│   │   │   ├── db.ts              # Sequelize init + DB seed
│   │   │   └── role.ts            # Role enum (Admin / User)
│   │   ├── _middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validateRequest.ts
│   │   ├── auth/
│   │   │   └── auth.controller.ts # POST /auth/login, /auth/register
│   │   ├── accounts/
│   │   │   └── accounts.controller.ts
│   │   ├── users/
│   │   │   ├── user.model.ts
│   │   │   ├── user.service.ts
│   │   │   └── users.controller.ts
│   │   ├── employees/
│   │   │   └── employees.controller.ts
│   │   ├── departments/
│   │   │   └── departments.controller.ts
│   │   └── requests/
│   │       └── requests.controller.ts
│   ├── dist/                      # Compiled JS output (after build)
│   ├── config.json                # DB credentials + JWT secret
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── index.html
    ├── script.js
    └── style.css
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v18 or higher |
| npm | v8 or higher |
| MySQL | v8.0 or higher |

Make sure MySQL is running before starting the backend.

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure the database

Edit `backend/config.json` with your MySQL credentials:

```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "your_password_here",
    "database": "fullstack_app_db"
  },
  "jwtSecret": "change-this-in-production-123!"
}
```
The app will **automatically create the database** (`fullstack_app_db`) and all tables on first run — no manual schema setup needed.

### 3. Start the backend

**Development mode** (hot-reload via nodemon):
```bash
npm run start:dev
```

**Production mode** (compile first, then run):
```bash
npm run build
npm start
```

The server starts at **http://localhost:4000**.

> You should see:
> ```
> ✅ Database initialized
> ✅ Server running on http://localhost:4000
> ✅ Login in Admin account to test: admin@example.com / admin123
> ```

---

## Frontend Setup

No build step required — the frontend is plain HTML/CSS/JS.

Open `frontend/index.html` directly in your browser, **or** serve it with a simple local server to avoid any CORS/path issues:

```bash
# Using npx (no install needed)
npx serve frontend

```

> Make sure the backend is running at `http://localhost:4000` before using the frontend.

---

## Default Admin Account

An admin account is automatically seeded on first startup:

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `admin123` |
| Role | `Admin` |

Login with this account to access all admin-only features (account verification, full CRUD across all resources).

---

## API Reference

Base URL: `http://localhost:4000`

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login with email + password |
| POST | `/auth/register` | Register a new account (role defaults to `User`, unverified) |

**Login body:**
```json
{ "email": "admin@example.com", "password": "admin123" }
```

**Register body:**
```json
{ "firstname": "Jane", "lastname": "Doe", "email": "jane@example.com", "password": "secret123" }
```

---

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/accounts` | Get all accounts |
| GET | `/accounts/:id` | Get account by ID |
| POST | `/accounts` | Create account |
| PUT | `/accounts/:id` | Update account |
| DELETE | `/accounts/:id` | Delete account |
| POST | `/accounts/:id/verify` | Verify an account (Admin action) |

---

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

---

### Employees

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | Get all employees |
| GET | `/employees/:id` | Get employee by ID |
| POST | `/employees` | Create employee |
| PUT | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |

**Create body:**
```json
{
  "empId": "EMP001",
  "name": "John Smith",
  "email": "john@company.com",
  "position": "Developer",
  "department": "Engineering",
  "hireDate": "2024-01-15"
}
```

---

### Departments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/departments` | Get all departments |
| GET | `/departments/:id` | Get department by ID |
| POST | `/departments` | Create department |
| PUT | `/departments/:id` | Update department |
| DELETE | `/departments/:id` | Delete department |

**Create body:**
```json
{ "name": "Engineering", "description": "Software development team" }
```

---

### Requests

| Method | Endpoint | Description |
|---|---|---|
| GET | `/requests` | Get all requests |
| GET | `/requests/my/:email` | Get requests by employee email |
| POST | `/requests` | Submit a new request |
| PUT | `/requests/:id/approve` | Approve a request (Admin) |
| PUT | `/requests/:id/reject` | Reject a request (Admin) |
| DELETE | `/requests/:id` | Delete a request |

**Create body:**
```json
{
  "type": "Equipment",
  "items": [{ "name": "Laptop", "qty": 1 }],
  "employeeEmail": "john@company.com"
}
```
> Valid request types: `Equipment`, `Leave`, `Resources`


## Testing the App

### Manual testing via the frontend

1. Start the backend (`npm run start:dev` inside `backend/`).
2. Open `frontend/index.html` in your browser.
3. **Register** a new account via the Register page.
4. **Login as Admin** (`admin@example.com` / `admin123`) to verify the new account.
5. **Login as the new user** and test employee/department/request CRUD.

### Manual testing via curl or Postman

**Login:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Create a department:**
```bash
curl -X POST http://localhost:4000/departments \
  -H "Content-Type: application/json" \
  -d '{"name":"Engineering","description":"Dev team"}'
```

**Submit a request:**
```bash
curl -X POST http://localhost:4000/requests \
  -H "Content-Type: application/json" \
  -d '{"type":"Equipment","items":[{"name":"Monitor","qty":2}],"employeeEmail":"admin@example.com"}'
```

**Approve a request (replace 1 with the actual request ID):**
```bash
curl -X PUT http://localhost:4000/requests/1/approve
```

### Running the built-in test script

```bash
cd backend
npm test
```

> This runs `tests/users.test.ts` via `ts-node`.
---

