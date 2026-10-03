# Employee Management System with CI/CD Automation

A full-stack web application with automated continuous integration and continuous deployment (CI/CD) using Jenkins, Docker, and PostgreSQL.

---

## 📌 Project Overview
The goal of this project is to build a real-world, production-ready Employee Management System while implementing DevOps best practices:
- Manage employee records (Create, Read, Update, Delete, Search, and Filter).
- Centralized error handling and input validation.
- Containerized multi-service architecture (Frontend, Backend, Database).
- Automated CI/CD pipeline using Jenkins to test, build, and deploy container images safely with health checks and rollback mechanisms.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** *(Phase 3)* | React, TypeScript, Vite | Fast, modern, type-safe user interface |
| **Backend** *(Phase 2)* | Node.js, Express, TypeScript | RESTful API with validation and centralized error handling |
| **Database** *(Phase 2)* | PostgreSQL (`pg` driver) | Relational database with SQL migrations and indexing |
| **Testing** *(Phase 2)* | Jest, Supertest, `ts-jest` | Automated unit & integration tests for API endpoints |
| **Version Control** | Git & GitHub | Source code tracking and pipeline triggering |
| **Containerization** | Docker, Docker Compose | Multi-container orchestration |
| **CI/CD Automation** | Jenkins (`Jenkinsfile`) | Automated checkout, testing, image building, deployment, and verification |

---

## 🏗️ Backend Architecture (Phase 2)

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts            # PostgreSQL connection pool with pg.Pool
│   ├── controllers/
│   │   ├── employeeController.ts  # CRUD handlers and query filter logic
│   │   └── healthController.ts    # Health check & DB latency probe
│   ├── middleware/
│   │   ├── errorHandler.ts        # Centralized Express error handler (DB & HTTP errors)
│   │   └── validateEmployee.ts    # Input validation middleware (Email, Salary, ID)
│   ├── models/
│   │   └── employeeModel.ts       # Raw parameterized SQL data access layer
│   ├── routes/
│   │   ├── employeeRoutes.ts      # /api/employees routes
│   │   └── healthRoutes.ts        # /api/health route
│   ├── scripts/
│   │   ├── migrate.ts             # Migration runner script
│   │   └── seed.ts                # Sample data seed script
│   ├── app.ts                     # Express app configuration & middleware
│   └── server.ts                  # Server entry point & DB startup verification
├── tests/
│   ├── employee.test.ts           # Full test suite for employee CRUD & validation
│   └── health.test.ts             # Test suite for health probes & 404 handler
├── migrations/
│   └── 001_create_employees.sql   # DDL script creating employees table & indexes
├── seeds/
│   └── seed_employees.sql         # Realistic seed records for local testing
├── jest.config.ts
├── package.json
├── tsconfig.json
└── .env
```

---

## 🗄️ Database Schema & Migration

The `employees` table schema is defined in `backend/migrations/001_create_employees.sql`:

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-incrementing internal ID |
| `employee_id` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | Business employee code (e.g. `EMP-1001`) |
| `first_name` | `VARCHAR(100)` | `NOT NULL` | First name |
| `last_name` | `VARCHAR(100)` | `NOT NULL` | Last name |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Unique work email |
| `phone` | `VARCHAR(50)` | Nullable | Contact phone number |
| `department` | `VARCHAR(100)` | `NOT NULL` | Department name (e.g. Engineering, HR) |
| `role` | `VARCHAR(100)` | `NOT NULL` | Job title (e.g. DevOps Engineer) |
| `salary` | `NUMERIC(12, 2)`| `NOT NULL`, `CHECK (salary > 0)` | Annual salary |
| `hire_date` | `DATE` | `NOT NULL` | Date of hire |
| `created_at` | `TIMESTAMPTZ` | Default `CURRENT_TIMESTAMP` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | Default `CURRENT_TIMESTAMP` | Last updated timestamp |

---

## 🚀 How to Run the Backend Locally

### Step 1: Start PostgreSQL using Docker

Open your terminal and run:

```powershell
# From the project root:
docker compose -f docker/docker-compose.db.yml up -d
```

### Step 2: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 3: Run Database Migrations and Seed Data

```powershell
# Apply the database table schema
npm run migrate

# Insert realistic sample employees
npm run seed
```

### Step 4: Run Automated Tests

```powershell
npm test
```

### Step 5: Start the Development Server

```powershell
npm run dev
```

The API will start at: `http://localhost:5000`

---

## 📡 API Endpoints

### 1. Health Check
- **`GET /api/health`**
  - Response (`200 OK`):
    ```json
    {
      "status": "healthy",
      "timestamp": "2026-10-03T17:20:00.000Z",
      "uptime": 12.34,
      "services": {
        "api": "up",
        "database": "connected",
        "dbLatencyMs": 4
      }
    }
    ```

### 2. Employees API
- **`GET /api/employees`** - List all employees (supports `?search=`, `?department=`, `?role=`)
- **`GET /api/employees/:id`** - Get single employee by ID
- **`POST /api/employees`** - Create new employee
  - Body:
    ```json
    {
      "employee_id": "EMP-2001",
      "first_name": "Sarah",
      "last_name": "Connor",
      "email": "sarah.connor@example.com",
      "phone": "+1-555-0303",
      "department": "Engineering",
      "role": "Security Engineer",
      "salary": 120000,
      "hire_date": "2023-08-01"
    }
    ```
- **`PUT /api/employees/:id`** - Update employee details
- **`DELETE /api/employees/:id`** - Delete employee record

---

## 📍 Project Roadmap & Status

- [x] **Phase 1: Project Initialization & Environment Audit**
- [x] **Phase 2: Backend API & PostgreSQL Database Layer**
- [ ] **Phase 3: Frontend Dashboard (React + TypeScript)**
- [ ] **Phase 4: Multi-Container Docker & Compose Setup**
- [ ] **Phase 5: Jenkins CI/CD Pipeline (`Jenkinsfile`)**
- [ ] **Phase 6: Health Probes, Rollback & Final Documentation**
