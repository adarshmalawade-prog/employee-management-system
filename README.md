# Employee Management System with CI/CD Automation

A full-stack web application with automated continuous integration and continuous deployment (CI/CD) using Jenkins, Docker, and PostgreSQL.

---

## 📌 Project Overview
The goal of this project is to build a real-world, production-ready Employee Management System while implementing DevOps best practices:
- Manage employee records (Create, Read, Update, Delete, Search, and Filter).
- Live backend connection health monitoring.
- Dynamic workforce statistics and metrics.
- Centralized error handling and input validation.
- Multi-container architecture orchestrating Frontend, Backend, and PostgreSQL Database via Docker Compose.
- Automated CI/CD pipeline using Jenkins to test, build, and deploy container images safely with health checks and rollback mechanisms.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Nginx | Modern, responsive dashboard served through high-performance Nginx |
| **Backend** | Node.js, Express, TypeScript | RESTful API with validation and centralized error handling |
| **Database** | PostgreSQL 16 (`pg` driver) | Relational database with SQL migrations and indexing |
| **Testing** | Jest, Supertest, `ts-jest` | Automated unit & integration tests for API endpoints |
| **Containerization** | Docker, Docker Compose | Multi-container orchestration, health checks, and named volume persistence |
| **Version Control** | Git & GitHub | Source code tracking and pipeline triggering |
| **CI/CD Automation** *(Phase 5)* | Jenkins (`Jenkinsfile`) | Automated checkout, testing, image building, deployment, and verification |

---

## 🐳 Running with Docker (Phase 4A)

### 1. Requirements
- **Docker Desktop** installed and running on Windows (with WSL2 backend enabled).
- Git.

### 2. Architecture & Networking

```
  [ Web Browser ]
        │
        ▼ (Port 3000)
┌─────────────────────────────────────────────────────────────┐
│ Docker Network: ems_network                                 │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Frontend Container (ems-frontend: Nginx)           │   │
│   │  - Serves static React SPA build files (Port 80)     │   │
│   │  - Reverse-proxies /api/ requests to Backend container│  │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│                              │ /api/ (Internal Port 5000)   │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Backend Container (ems-backend: Node.js)           │   │
│   │  - Express REST API & Health check                  │   │
│   │  - Automatic idempotent migration & seed on startup │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│                              │ SQL Queries (Port 5432)      │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  PostgreSQL Container (ems-postgres: Postgres 16)   │   │
│   │  - Database: employee_db                            │   │
│   │  - Persistent storage mounted on ems_postgres_data  │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

> **Important:** The browser runs outside the Docker network. The React application sends requests to the relative path `/api`, which Nginx forwards internally to `http://backend:5000/api/`. The browser never needs to resolve the Docker-internal hostname `backend`.

---

### 3. Start the Full Application Stack

Run from the project root directory (`D:\employee-management-system`):

```powershell
docker compose up --build
```

*(To run in background/detached mode, add the `-d` flag: `docker compose up --build -d`)*

### 4. Access the Services

- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API Direct:** [http://localhost:5000/api/employees](http://localhost:5000/api/employees)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health) (or through frontend proxy: [http://localhost:3000/api/health](http://localhost:3000/api/health))

### 5. Check Container Status and Healthchecks

```powershell
docker compose ps
```

### 6. Stop the Application

```powershell
docker compose down
```

### 7. Database Persistence & Reset

- **Data Persistence:** PostgreSQL stores its data inside the named Docker volume `ems_postgres_data`. When you stop the containers with `docker compose down` and restart them with `docker compose up`, all employee records and updates are preserved.
- **Complete Database Reset:**
  ```powershell
  docker compose down -v
  ```
  > ⚠️ **Warning:** The `-v` flag deletes all Docker volumes associated with the project, including the database volume. Use this only when you explicitly want to start with a fresh database and re-seed sample data.

---

## 💻 Local Development (Without Docker Compose)

If you prefer to run services individually on the host machine:

### 1. Start Standalone PostgreSQL
```powershell
docker compose -f docker/docker-compose.db.yml up -d
```

### 2. Start Backend API
```powershell
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

### 3. Start Frontend Dashboard
```powershell
cd frontend
npm install
npm run dev
```

---

## 📍 Project Roadmap & Status

- [x] **Phase 1: Project Initialization & Environment Audit**
- [x] **Phase 2: Backend API & PostgreSQL Database Layer**
- [x] **Phase 3: React + TypeScript Employee Dashboard**
- [x] **Phase 4A: Multi-Container Dockerization (Postgres + Backend + Frontend/Nginx)**
- [ ] **Phase 4B / Phase 5: Jenkins CI/CD Pipeline (`Jenkinsfile`)**
- [ ] **Phase 6: Health Probes, Rollback & Final Documentation**
