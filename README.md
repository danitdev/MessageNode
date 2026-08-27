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
- Post ownership and authorization
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
```

Controllers handle HTTP concerns while services contain application and database logic.

Authentication and authorization are handled through middleware and service-level ownership checks.

---

## 🔐 Authentication

Authentication uses **JWT** with **Argon2id** password hashing.

Protected requests use:

```http
Authorization: Bearer <token>
```

Authenticated user information is propagated through the Express request and used for authorization and resource ownership checks.

---

## 📝 Posts

Users can:

- Create posts
- View posts
- View individual posts
- Edit their own posts
- Delete their own posts
- Upload images
- Replace post images

Posts are associated with their creator through a Prisma relationship.

---

## 🖼️ Image Uploads

Images are uploaded using **Multer** and currently stored on the local filesystem.

Images are served through:

```text
/images/<filename>
```

When posts are updated or deleted, associated image files are cleaned up.

Production object storage is planned for a future deployment.

---

## 📡 API

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/auth/signup` | Register |
| POST | `/auth/login` | Login |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/feed/posts` | Get user's posts |
| GET | `/feed/post/:postId` | Get a post |
| POST | `/feed/post` | Create a post |
| PUT | `/feed/post/:postId` | Update a post |
| DELETE | `/feed/post/:postId` | Delete a post |

### Status

| Method | Endpoint | Description |
|---|---|---|
| GET | `/status` | Get user status |
| PATCH | `/status` | Update user status |

Protected endpoints require authentication.

---

## 📦 Running Locally

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

The backend runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=message-node

JWT_SECRET=...
PORT=8080
```

Never commit real credentials or secrets.

---

## 🗺️ Roadmap

- [ ] Automated testing
- [ ] Production image storage
- [ ] API documentation
- [ ] Rate limiting
- [ ] Production logging
- [ ] Security hardening
- [ ] Docker deployment
- [ ] CI/CD
- [ ] Frontend modernization
- [ ] Production deployment

---

## 🎯 Project Goals

Message Node is being developed as a practical full-stack project with an emphasis on:

- Type-safe backend development
- Clean architecture
- Secure authentication
- Resource authorization
- Runtime validation
- Maintainable database access
- Production-ready engineering practices

---

## 📄 License

This project is currently a personal learning/development project.
