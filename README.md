# Sundsgården Hotell & Konferens — Staff Login System

A full-stack web application for managing restaurant staff at Sundsgården. Employees log in with their email and a 4-digit code. Admin users can create, update, and delete employee records; non-admin users see a personal welcome page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL (via Prisma ORM) |
| Validation | Zod |
| Auth | Express sessions (cookie-based) |

---

## Project Structure

```
login-assessment-module2/
├── backend/
│   ├── index.ts                  # Express app entry point (port 3000)
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── seed.ts               # Seed script with test users
│   ├── routes/
│   │   ├── auth.ts               # Login, logout, /me endpoints
│   │   └── employees.ts          # Employee CRUD (admin only)
│   └── src/
│       ├── middleware/
│       │   └── requireAdmin.ts   # Role-based auth middleware
│       └── types/
│           └── index.ts          # TypeScript types & Zod schemas
└── frontend/
    └── src/
        ├── App.jsx               # Router + protected route logic
        ├── LoginPage.jsx         # Email + 4-digit code login form
        ├── AdminPage.jsx         # Employee management dashboard
        ├── WelcomePage.jsx       # Regular user welcome page
        ├── api.js                # Fetch-based API client
        └── session.js            # localStorage session helpers
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL running on port **5433** (non-default port)

> The `.env-example` file includes `PGADMIN_*` variables, so pgAdmin via Docker is a convenient way to manage the database locally.

---

## Setup & Running

### 1. Configure the backend environment

```bash
cd backend
cp .env-example .env
```

Edit `.env` with your database credentials:

```env
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=restaurant_db
POSTGRES_PORT=5433
DATABASE_URL="postgresql://root:root@localhost:5433/restaurant_db"
```

### 2. Install dependencies

Run both commands (they can be done in parallel in separate terminals):

```bash
# Terminal 1 — backend
cd backend && npm install

# Terminal 2 — frontend
cd frontend && npm install
```

### 3. Set up the database

```bash
cd backend

# Run migrations to create the tables
npx prisma migrate dev

# Seed the database with test users
npx prisma db seed
```

### 4. Start the development servers

```bash
# Terminal 1 — backend (http://localhost:3000)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Test Accounts

These accounts are created by the seed script:

| Name | Role | Email | Code |
|---|---|---|---|
| Michiel van der Gragt | ADMIN | michiel@sundsgarden.se | 1938 |
| Erik Lindqvist | HEAD_WAITER | erik@sundsgarden.se | 1111 |
| Anna Bergström | WAITER | anna@sundsgarden.se | 2222 |
| Marcus Holm | WAITER | marcus@sundsgarden.se | 3333 |
| Sofia Karlsson | RUNNER | sofia@sundsgarden.se | 4444 |
| Johan Nilsson | RUNNER | johan@sundsgarden.se | 5555 |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/login` | Login with `{ email, code }` |
| POST | `/logout` | Destroy current session |
| GET | `/me` | Get the currently logged-in user |

### Employees — `/api/employees` *(admin only)*

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all employees |
| POST | `/` | Create a new employee |
| PUT | `/:id` | Update an employee |
| DELETE | `/:id` | Delete an employee |

---

## Roles

| Role | Access |
|---|---|
| `ADMIN` | Full employee management via the admin dashboard |
| `HEAD_WAITER` | Welcome page only |
| `WAITER` | Welcome page only |
| `RUNNER` | Welcome page only |
# login-demo
