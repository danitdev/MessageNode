# Message Node

A full-stack social feed application built by modernizing an older React project with a **TypeScript + Express + Prisma** backend.

The project focuses on clean backend architecture, authentication, authorization, validation, database access, and file uploads.

---

## 🚧 Status

**In active development.**

### Implemented

- TypeScript + Express backend
- Prisma + MySQL
- User registration and login
- JWT authentication
- Argon2id password hashing
- Authentication middleware
- Post CRUD operations
- Post ownership/authorization
- Pagination
- User status management
- Image uploads with Multer
- Local image serving and cleanup
- Zod request validation
- Centralized error handling
- React frontend integration

### Planned

- Automated tests
- Production image storage
- Login validation
- Rate limiting and security hardening
- API documentation
- Frontend modernization
- Production deployment

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- CSS
- Fetch API

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- MySQL
- Zod
- Multer
- Argon2
- JSON Web Tokens

---

## 🏗️ Architecture

Message Node follows a layered backend architecture:

```text
Request
   │
   ▼
Middleware
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Prisma
   │
   ▼
MySQL
