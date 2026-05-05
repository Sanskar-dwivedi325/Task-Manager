# Project Workspace

Project Workspace is a full-stack project and task management application with JWT authentication, role-based access, project membership, task assignment, and dashboard reporting.

The repository is split into:

- `backend`: Java Spring Boot API with Spring Security, JWT, JPA/Hibernate, and MySQL.
- `frontend`: React Vite client with Tailwind CSS, Axios, React Router, protected routes, and toast notifications.

Spring Boot is pinned to `4.0.6`, the latest stable release published by the Spring team on April 23, 2026.

## Tech Stack

Backend:

- Java 21
- Spring Boot 4.0.6
- Spring Security
- JWT with `jjwt`
- Spring Data JPA / Hibernate
- MySQL
- Bean Validation

Frontend:

- React 19
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast
- Lucide React

## Features

- Signup and login with encrypted passwords.
- JWT-secured REST API.
- Roles: `ADMIN` and `MEMBER`.
- Admin project management.
- Admin task creation, assignment, and deletion.
- Member views for assigned projects and tasks.
- Member task status updates.
- Admin and member dashboard metrics.
- Empty states, loading states, form validation, date formatting, and toast feedback.
- Sample seed data for a quick local demo.

## Sample Accounts

The backend seeds these accounts when the database is empty:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@projectworkspace.dev` | `password123` |
| Member | `maya@projectworkspace.dev` | `password123` |
| Member | `noah@projectworkspace.dev` | `password123` |

## API Endpoints

Authentication:

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |

Projects:

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/projects` | Admin |
| GET | `/api/projects` | Authenticated |
| GET | `/api/projects/{id}` | Authenticated project access |
| PUT | `/api/projects/{id}` | Admin |
| DELETE | `/api/projects/{id}` | Admin |

Tasks:

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/tasks` | Admin |
| GET | `/api/tasks` | Authenticated |
| PUT | `/api/tasks/{id}` | Admin or assigned member status update |
| DELETE | `/api/tasks/{id}` | Admin |

Additional app endpoints:

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/dashboard` | Authenticated |
| GET | `/api/users/members` | Admin |
| GET | `/actuator/health` | Public |

## Local Setup

Prerequisites:

- Java 21
- Maven 3.9+
- Node.js 20+
- MySQL 8+

Create a local MySQL database:

```sql
CREATE DATABASE project_workspace;
```

Start the backend:

```bash
cd backend
cp .env.example .env
./mvnw.cmd spring-boot:run
```

If Maven is installed globally, `mvn spring-boot:run` works too. On Windows PowerShell, set environment variables directly or rely on the defaults in `application.properties`.

Start the frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Backend:

| Variable | Description |
| --- | --- |
| `PORT` | Server port, defaults to `8080`. |
| `MYSQL_JDBC_URL` | Optional full JDBC connection string. |
| `MYSQLHOST` | MySQL host. Railway provides this from the MySQL service. |
| `MYSQLPORT` | MySQL port. Railway provides this from the MySQL service. |
| `MYSQLDATABASE` | MySQL database name. Railway provides this from the MySQL service. |
| `MYSQLUSER` | MySQL username. |
| `MYSQLPASSWORD` | MySQL password. |
| `JWT_SECRET` | Base64-encoded JWT signing secret. Use a long random value in production. |
| `JWT_EXPIRATION_MS` | JWT lifetime in milliseconds. |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins. |
| `JPA_DDL_AUTO` | Hibernate DDL mode, defaults to `update`. |

Frontend:

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL, for example `https://your-api.railway.app/api`. |

## Railway Deployment

Backend:

1. Create a Railway project.
2. Add a MySQL service.
3. Add a backend service from this repository and set the root directory to `backend`.
4. Configure variables:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRATION_MS`
   - `CORS_ALLOWED_ORIGINS`
   - `JPA_DDL_AUTO=update`
5. Railway will use Java 21 from `backend/system.properties`.
6. Deploy and confirm `/actuator/health` returns `UP`.

Frontend:

1. Add another Railway service with root directory `frontend`.
2. Set `VITE_API_BASE_URL` to the deployed backend URL ending in `/api`.
3. Build command: `npm install && npm run build`.
4. Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`.
5. Add the frontend Railway URL to backend `CORS_ALLOWED_ORIGINS`.

## Screenshots

Add screenshots after deployment:

- Login page
- Admin dashboard
- Project list
- Project details
- Task management
- Member dashboard

## Demo Video

Suggested demo flow:

1. Login as the seeded admin account.
2. Show dashboard metrics.
3. Create a project and add members.
4. Create a task for a project member.
5. Login as the member.
6. Show assigned projects and tasks.
7. Update task status and return to the dashboard.

## Production Notes

- Replace the development JWT secret before deploying.
- Keep `JPA_DDL_AUTO=validate` or migrations such as Flyway/Liquibase for mature production environments.
- Restrict `CORS_ALLOWED_ORIGINS` to deployed frontend domains only.
- Rotate database credentials through Railway variables.
- Add integration tests around authorization rules before expanding the app.
