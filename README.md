# Message Node

A full-stack social feed application built by modernizing an older React project into a **TypeScript + Express + Prisma** backend.

The project focuses on building a maintainable REST API with layered controller/service architecture, JWT authentication, runtime validation, file uploads, Prisma/MySQL database access, centralized error handling, and ownership-aware resource operations.

---

## 🚧 Project Status

**In active development.**

### Backend

* [x] TypeScript backend
* [x] Express 5 server
* [x] Prisma 7 ORM
* [x] MySQL database
* [x] Prisma MariaDB adapter
* [x] User model
* [x] Post model
* [x] User/Post relationship
* [x] User registration
* [x] Argon2id password hashing
* [x] JWT authentication
* [x] Authentication middleware
* [x] Authenticated user ID propagation through `req.userId`
* [x] Get authenticated user's posts
* [x] Get a single post
* [x] Create a post
* [x] Update a post
* [x] Delete a post
* [x] Pagination
* [x] User status API
* [x] Image uploads with Multer
* [x] Static image serving
* [x] Image replacement cleanup
* [x] Image deletion cleanup
* [x] Custom `AppError`
* [x] Centralized Express error handling
* [x] Zod request validation middleware
* [x] Post ownership checks
* [ ] Login request validation
* [ ] Production-ready image storage
* [ ] Automated tests
* [ ] Complete API documentation
* [ ] Production hardening

### Frontend

* [x] React application
* [x] React Router
* [x] Login
* [x] Signup
* [x] Authenticated feed
* [x] Single-post view
* [x] Create post
* [x] Edit post
* [x] Delete post
* [x] User status updates
* [x] Pagination UI
* [x] JWT persistence
* [ ] React/React Router modernization
* [ ] Centralized API client
* [ ] Production API configuration
* [ ] Improved authentication state management
* [ ] Frontend TypeScript migration

---

## 🛠️ Tech Stack

### Frontend

* React 16
* React Router 4
* CSS
* Fetch API
* Create React App / `react-scripts`

The frontend originated from an older React social-network application and is being progressively adapted to communicate with the new backend.

### Backend

* Node.js
* Express 5
* TypeScript
* Prisma 7
* MySQL
* `@prisma/adapter-mariadb`
* Zod
* Multer
* Argon2
* JSON Web Tokens
* CORS
* dotenv

---

## 🏗️ Architecture

The backend follows a layered architecture:

```text
HTTP Request
     │
     ▼
Express Middleware
     │
     ├── Authentication
     ├── Validation
     └── File Upload
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
Prisma Client
     │
     ▼
MySQL
```

Controllers primarily handle HTTP concerns:

* Reading route parameters
* Reading authenticated user information
* Constructing service inputs
* Returning HTTP responses
* Forwarding errors

Services contain application and database logic:

* Database queries
* Ownership checks
* CRUD operations
* Relationship loading
* File cleanup

---

## 📁 Backend Structure

The backend is organized by feature/module:

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── errors/
│   │   └── AppError.ts
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── middleware/
│   │   ├── isAuth.ts
│   │   └── validate.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── authController.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── authSchema.ts
│   │   │   └── authSevice.ts
│   │   │
│   │   ├── posts/
│   │   │   ├── postController.ts
│   │   │   ├── postRoutes.ts
│   │   │   ├── postSchema.ts
│   │   │   └── postService.ts
│   │   │
│   │   └── status/
│   │       ├── statusController.ts
│   │       ├── statusRoutes.ts
│   │       ├── statusSchema.ts
│   │       └── statusService.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   ├── auth.ts
│   │   ├── deleteImage.ts
│   │   └── path.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## 🗄️ Database

Message Node uses **Prisma 7 with MySQL** through the Prisma MariaDB adapter.

### User

```text
User
├── id
├── name
├── email
├── password
├── status
└── posts[]
```

### Post

```text
Post
├── id
├── title
├── content
├── imageUrl
├── createdAt
├── creatorId
└── creator
```

Relationship:

```text
User 1 ──────────── N Post
```

Each post belongs to a user through `creatorId`.

The `status` field currently defaults to:

```text
"active"
```

---

## 🔐 Authentication

Authentication is implemented using **JWTs**.

### Registration

```http
PUT /auth/signup
```

Registration validates:

* Name
* Email
* Password

Passwords are hashed using **Argon2id** before being stored.

### Login

```http
POST /auth/login
```

Successful authentication returns:

```json
{
  "token": "...",
  "userId": 1
}
```

The JWT contains:

```text
userId
email
```

and currently expires after **1 hour**.

### Protected Requests

Authenticated requests use:

```http
Authorization: Bearer <token>
```

The authentication middleware:

1. Reads the `Authorization` header.
2. Extracts the bearer token.
3. Verifies the JWT.
4. Extracts `userId`.
5. Attaches it to `req.userId`.

TypeScript is extended accordingly:

```ts
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
```

---

## 🔒 Authorization & Ownership

Authentication and authorization are treated separately.

Authentication establishes **who the user is**.

Authorization establishes **whether that user can access a resource**.

Post operations perform ownership checks using:

```text
req.userId
     │
     ▼
Post.creatorId
     │
     ├── Match → allowed
     │
     └── Mismatch → 403 Forbidden
```

A user cannot update or delete another user's post.

---

## 🔌 API

All post routes are mounted under `/feed`.

### Authentication

| Method | Endpoint       | Auth | Description         |
| ------ | -------------- | ---: | ------------------- |
| PUT    | `/auth/signup` |   No | Create a user       |
| POST   | `/auth/login`  |   No | Authenticate a user |

### Posts

| Method | Endpoint             | Auth | Description                    |
| ------ | -------------------- | ---: | ------------------------------ |
| GET    | `/feed/posts`        |  Yes | Get authenticated user's posts |
| GET    | `/feed/post/:postId` |  Yes | Get a single owned post        |
| POST   | `/feed/post`         |  Yes | Create a post                  |
| PUT    | `/feed/post/:postId` |  Yes | Update an owned post           |
| DELETE | `/feed/post/:postId` |  Yes | Delete an owned post           |

### Status

| Method | Endpoint  | Auth | Description                        |
| ------ | --------- | ---: | ---------------------------------- |
| GET    | `/status` |  Yes | Get authenticated user's status    |
| PATCH  | `/status` |  Yes | Update authenticated user's status |

---

## 📄 Get Posts

```http
GET /feed/posts?page=1
Authorization: Bearer <token>
```

Posts are:

* User-scoped
* Ordered by `createdAt` descending
* Paginated
* Loaded with creator information

The current page size is:

```text
2 posts
```

Example response:

```json
{
  "message": "Fetched posts successfully",
  "posts": [],
  "totalItems": 0
}
```

### Known Issue

The actual post query is scoped to the authenticated user, but the current `totalItems` count does not apply the same user filter.

As a result, pagination metadata can currently report the total number of posts in the database rather than the total number belonging to the authenticated user.

This is tracked in the roadmap.

---

## 🔎 Get a Single Post

```http
GET /feed/post/:postId
Authorization: Bearer <token>
```

The service verifies both:

```text
postId
creatorId
```

so users cannot retrieve another user's post through this endpoint.

If the post does not exist:

```http
404 Not Found
```

---

## ➕ Create a Post

```http
POST /feed/post
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Fields:

```text
title
content
image
```

An image is currently required when creating a post.

### Validation

#### Title

* Minimum: 5 characters
* Maximum: 100 characters
* Whitespace trimmed

#### Content

* Minimum: 5 characters
* Maximum: 5000 characters
* Whitespace trimmed

The authenticated user's ID is used as `creatorId`; clients do not choose the post owner.

---

## ✏️ Update a Post

```http
PUT /feed/post/:postId
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Fields:

```text
title
content
image
```

The image is optional during updates.

When a new image is supplied:

```text
Existing Post
     │
     ├── Retrieve old image path
     │
     ▼
Multer saves new image
     │
     ▼
Database updated
     │
     ▼
Old image deleted
```

The old image path comes from the database rather than client-provided input.

Ownership is verified before the update is performed.

---

## 🗑️ Delete a Post

```http
DELETE /feed/post/:postId
Authorization: Bearer <token>
```

Deletion performs:

1. Find the post.
2. Verify ownership.
3. Delete the database record.
4. Delete its image from disk if one exists.

Possible errors:

```text
404 → Post not found
403 → Post belongs to another user
```

---

## 🖼️ Image Uploads

Multer handles local image storage.

Accepted MIME types:

```text
image/png
image/jpg
image/jpeg
```

Images are exposed through:

```ts
app.use("/images", express.static(...));
```

Example:

```text
/images/1723456789-example.jpg
```

The application also cleans up image files when:

* A post image is replaced
* A post is deleted

The current filesystem-based implementation is intended for development and is not yet suitable for horizontally scaled production deployments.

---

## 🛡️ Validation

Runtime request validation uses **Zod**.

The validation middleware calls:

```ts
schema.safeParse(req.body)
```

Invalid requests result in:

```http
422 Unprocessable Entity
```

Validated data is written back to:

```ts
req.body
```

Current validation schemas cover:

* User registration
* Post creation/update
* Status updates

Login validation is still a planned improvement.

---

## ⚠️ Error Handling

The backend uses a custom `AppError`:

```ts
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

Services can throw application errors:

```ts
throw new AppError("Couldn't find the post.", 404);
```

Controllers forward errors through Express:

```ts
catch (err) {
  next(err);
}
```

A centralized error middleware converts application errors into HTTP responses.

This avoids duplicating response/error logic throughout controllers.

---

## 🔑 Password Security

Passwords are never stored as plaintext.

Registration:

```text
Plain Password
      │
      ▼
   Argon2id
      │
      ▼
Password Hash
      │
      ▼
    MySQL
```

Login verifies the supplied password against the stored Argon2 hash.

Current Argon2 configuration:

```text
type: Argon2id
memoryCost: 65536
timeCost: 3
parallelism: 4
```

---

## 👤 User Status

Authenticated users can read and update their status.

```http
GET /status
Authorization: Bearer <token>
```

```http
PATCH /status
Authorization: Bearer <token>
Content-Type: application/json
```

Example:

```json
{
  "status": "active"
}
```

Status operations are implemented through their own controller/service/schema module.

---

## 🖥️ Frontend

The frontend remains based on the original React application.

```text
frontend/src/
├── pages/
│   ├── Auth/
│   │   ├── Login.js
│   │   └── Signup.js
│   │
│   └── Feed/
│       ├── Feed.js
│       └── SinglePost/
│           └── SinglePost.js
│
├── components/
│   ├── Feed/
│   ├── Form/
│   ├── Navigation/
│   ├── Paginator/
│   └── ...
│
├── util/
└── App.js
```

The frontend currently uses `fetch()` directly rather than a centralized API client.

Development endpoints:

```text
Frontend → http://localhost:3000
Backend  → http://localhost:8080
```

The backend is configured with CORS for the frontend development origin.

---

## 🔄 Frontend Authentication Flow

After login, the frontend stores:

```text
token
userId
expiryDate
```

in `localStorage`.

The flow is:

```text
Login
  │
  ▼
POST /auth/login
  │
  ▼
JWT returned
  │
  ▼
localStorage
  │
  ▼
Authenticated React state
  │
  ▼
Authorization: Bearer <token>
```

The frontend also performs client-side automatic logout after the configured one-hour lifetime.

> **Production consideration:** storing authentication tokens in `localStorage` requires careful XSS protection. A production authentication architecture should evaluate alternatives such as secure, HttpOnly cookies and refresh-token/session strategies.

---

## 📦 Installation

### Backend

```bash
cd backend
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Start development mode:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Run the compiled server:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm start
```

---

## 🗃️ Prisma

The project uses Prisma migrations.

After changing the Prisma schema:

```bash
npx prisma migrate dev --name <migration_name>
```

Regenerate the Prisma client when necessary:

```bash
npx prisma generate
```

Development seed data is provided through:

```text
prisma/seed.ts
```

---

## 🔐 Environment Variables

The backend expects database and authentication configuration through environment variables.

Example:

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

## 🧪 Testing

Automated tests have not yet been implemented.

The current backend contains a placeholder test script.

Planned testing strategy:

```text
Unit Tests
    │
    ├── Services
    ├── Validation
    └── Utilities

Integration Tests
    │
    ├── Authentication
    ├── Posts
    └── Status

API / End-to-End Tests
```

---

## 🗺️ Roadmap

### Backend

* [ ] Fix user-scoped pagination count
* [ ] Validate login requests with Zod
* [ ] Return structured validation errors
* [ ] Add automated unit tests
* [ ] Add integration/API tests
* [ ] Add structured logging
* [ ] Add rate limiting
* [ ] Add security headers
* [ ] Improve Prisma error mapping
* [ ] Add OpenAPI/API documentation
* [ ] Add production configuration
* [ ] Add graceful shutdown
* [ ] Add health/readiness endpoints

### Authentication

* [ ] Validate JWT configuration at startup
* [ ] Evaluate refresh-token/session architecture
* [ ] Add password reset
* [ ] Add email verification
* [ ] Add session invalidation/logout strategy
* [ ] Add role-based authorization if required

### File Storage

The current implementation stores images locally.

Production storage can eventually move to:

* Amazon S3
* Cloudflare R2
* Cloudinary

The goal is to make media storage independent from the application server so the backend can scale horizontally.

### Frontend

* [ ] Upgrade React
* [ ] Upgrade React Router
* [ ] Migrate frontend to TypeScript
* [ ] Build centralized API client
* [ ] Centralize authentication state
* [ ] Remove hard-coded API URLs
* [ ] Improve loading/error states
* [ ] Improve form validation
* [ ] Improve accessibility
* [ ] Add frontend tests

---

## 🎯 Architecture Goals

The long-term goal is to turn Message Node into a maintainable, secure full-stack application with:

* Strong TypeScript typing
* Runtime validation
* Clear controller/service boundaries
* Centralized error handling
* Secure authentication
* Explicit authorization
* Ownership-aware resource access
* Efficient database access
* Reliable media storage
* Automated testing
* Production observability
* Documented REST APIs
* Modern frontend architecture

The project is intentionally being developed incrementally.

Rather than simply reproducing the original application's implementation, the backend is being redesigned around modern TypeScript, modular architecture, runtime validation, authentication, authorization, and production-oriented engineering practices.

---

## 📌 Architecture Overview

```text
                    ┌──────────────────┐
                    │   React Client   │
                    │   localhost:3000 │
                    └────────┬─────────┘
                             │
                         HTTP/JSON
                             │
                             ▼
                    ┌──────────────────┐
                    │  Express Server  │
                    │   localhost:8080 │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
          Auth Routes    Post Routes    Status Routes
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌──────────────────┐
                    │    Middleware    │
                    │                  │
                    │ JWT              │
                    │ Zod              │
                    │ Multer           │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Controllers    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Services     │
                    └────────┬─────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
          ┌──────────────┐      ┌──────────────┐
          │    Prisma    │      │ Local Images │
          │   + MySQL    │      │   /images    │
          └──────────────┘      └──────────────┘
```

---

## 📄 License

This project is currently a personal learning/development project.
