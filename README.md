# Employee Management System with CI/CD Automation

A full-stack web application with automated continuous integration and continuous deployment (CI/CD) using Jenkins, Docker, and PostgreSQL.

---

## 📌 Project Overview
The goal of this project is to build a real-world, production-ready Employee Management System while implementing DevOps best practices:
- Manage employee records (Create, Read, Update, Delete, Search, and Filter).
- Live backend connection health monitoring.
- Dynamic workforce statistics and metrics.
- Centralized error handling and input validation.
- Containerized multi-service architecture (Frontend, Backend, Database).
- Automated CI/CD pipeline using Jenkins to test, build, and deploy container images safely with health checks and rollback mechanisms.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** *(Phase 3)* | React 18, TypeScript, Vite, CSS | Modern, responsive employee management dashboard |
| **Backend** *(Phase 2)* | Node.js, Express, TypeScript | RESTful API with validation and centralized error handling |
| **Database** *(Phase 2)* | PostgreSQL (`pg` driver) | Relational database with SQL migrations and indexing |
| **Testing** *(Phase 2)* | Jest, Supertest, `ts-jest` | Automated unit & integration tests for API endpoints |
| **Version Control** | Git & GitHub | Source code tracking and pipeline triggering |
| **Containerization** | Docker, Docker Compose | Multi-container orchestration |
| **CI/CD Automation** | Jenkins (`Jenkinsfile`) | Automated checkout, testing, image building, deployment, and verification |

---

## 🏗️ Project Architecture

```
employee-management-system/
├── backend/
│   ├── src/
│   │   ├── config/database.ts            # PostgreSQL connection pool with pg.Pool
│   │   ├── controllers/                  # CRUD and Health check controllers
│   │   ├── middleware/                   # Error handler and input validation
│   │   ├── models/                       # Parameterized SQL data access layer
│   │   ├── routes/                       # Express REST API routes
│   │   ├── app.ts                        # Express application instance
│   │   └── server.ts                     # Server entry point
│   ├── tests/                            # Jest + Supertest suites
│   ├── migrations/                       # SQL table creation DDL
│   └── seeds/                            # Sample database seed data
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx                # Header with live connection status
│   │   │   ├── StatsCards.tsx            # Dynamic metrics (Employees, Depts, Roles, Avg Salary)
│   │   │   ├── SearchBar.tsx             # Search input, department/role filters & Reset
│   │   │   ├── EmployeeTable.tsx         # Employee list table with Edit/Delete actions
│   │   │   ├── EmployeeModal.tsx         # Add/Edit employee dialog
│   │   │   ├── EmployeeForm.tsx          # Form validation & input controls
│   │   │   ├── DeleteConfirmModal.tsx    # Deletion confirmation modal
│   │   │   └── NotificationToast.tsx     # Feedback alert notifications
│   │   ├── pages/
│   │   │   └── Dashboard.tsx             # Main dashboard controller view
│   │   ├── services/
│   │   │   └── employeeApi.ts            # Frontend API client layer
│   │   ├── types/
│   │   │   └── employee.ts               # TypeScript data interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css                    # Professional responsive stylesheet
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker/
│   └── docker-compose.db.yml             # Standalone local PostgreSQL container
├── .env.example
└── README.md
```

---

## 🚀 How to Run the Application Locally

### Step 1: Start PostgreSQL Database
```powershell
docker compose -f docker/docker-compose.db.yml up -d
```

### Step 2: Start the Backend API
```powershell
cd d:\employee-management-system\backend
npm install
npm run migrate
npm run seed
npm run dev
```
*Backend runs at:* `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

### Step 3: Start the Frontend Dashboard
```powershell
cd d:\employee-management-system\frontend
npm install
npm run dev
```
*Frontend runs at:* `http://localhost:3000`

---

## 📡 Backend API Endpoints

- **`GET /api/health`** — Verify API and PostgreSQL connection status.
- **`GET /api/employees`** — List all employees (supports `?search=`, `?department=`, `?role=`).
- **`GET /api/employees/:id`** — Get a single employee by ID.
- **`POST /api/employees`** — Create a new employee record.
- **`PUT /api/employees/:id`** — Update an existing employee record.
- **`DELETE /api/employees/:id`** — Delete an employee record.

---

## 📍 Project Roadmap & Status

- [x] **Phase 1: Project Initialization & Environment Audit**
- [x] **Phase 2: Backend API & PostgreSQL Database Layer**
- [x] **Phase 3: React + TypeScript Employee Dashboard**
- [ ] **Phase 4: Multi-Container Docker & Compose Setup**
- [ ] **Phase 5: Jenkins CI/CD Pipeline (`Jenkinsfile`)**
- [ ] **Phase 6: Health Probes, Rollback & Final Documentation**
