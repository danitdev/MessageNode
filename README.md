# Message Node

A full-stack social messaging/feed application built while modernizing an older React project into a **TypeScript + Express + Prisma** backend.

The project is currently focused on building a clean REST API with proper service/controller separation, validation, file uploads, database access, and centralized error handling.

---

## 🚧 Project Status

**In active development.**

Current backend work includes:

* [x] TypeScript backend
* [x] Express server
* [x] Prisma ORM
* [x] MySQL database
* [x] Post model
* [x] User/Post relationship
* [x] Get all posts
* [x] Get a single post
* [x] Create a post
* [x] Update a post
* [x] Image upload with Multer
* [x] Static image serving
* [x] Image cleanup when replacing images
* [x] Custom `AppError`
* [x] Centralized Express error handling
* [x] Zod-based request validation setup
* [ ] Delete post
* [ ] Authentication/authorization
* [ ] User ownership checks
* [ ] Production-ready image storage
* [ ] Complete API documentation
* [ ] Frontend migration/modernization

---

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* CSS
* Fetch API

The frontend originated from an older React application and is being progressively adapted to communicate with the new backend.

### Backend

* Node.js
* Express
* TypeScript
* Prisma
* MySQL
* Zod
* Multer

### Architecture

The backend follows a layered structure:

```text
Request
   │
   ▼
Express Route
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

Controllers are responsible primarily for HTTP concerns, while services contain application/database logic.

---

## 📁 Backend Architecture

The backend is organized by feature rather than putting all controllers and services into global folders.

Example:

```text
src/
├── errors/
│   └── AppError.ts
│
├── lib/
│   └── prisma.ts
│
├── utils/
│   ├── path.ts
│   └── deleteImage.ts
│
├── modules/
│   └── posts/
│       ├── postController.ts
│       ├── postService.ts
│       └── postSchema.ts
│
├── app.ts
└── server.ts
```

The exact folder names may evolve as the project continues to grow.

---

## 📝 Posts

Posts currently contain information such as:

```text
Post
├── id
├── title
├── content
├── imageUrl
├── creatorId
└── createdAt
```

Posts have a relationship with a `User` through `creatorId`.

---

## 🔌 API

The current API is centered around posts.

### Get all posts

```http
GET /posts
```

Returns the posts ordered by creation date, along with creator information.

Example response:

```json
{
  "posts": [
    {
      "id": 1,
      "title": "Hello World",
      "content": "My first post",
      "imageUrl": "/images/example.jpg",
      "creator": {
        "name": "User"
      }
    }
  ],
  "totalItems": 1
}
```

---

### Get a single post

```http
GET /posts/:postId
```

Returns a single post and its creator.

If the post doesn't exist:

```http
404 Not Found
```

---

### Create a post

```http
POST /posts
```

The endpoint accepts multipart form data because posts can contain an image.

Example fields:

```text
title
content
image
```

The image is processed using Multer and stored on the server.

---

### Update a post

```http
PUT /posts/:postId
```

The update endpoint currently accepts:

```text
title
content
image
```

When a new image is uploaded:

```text
New image
   ↓
Multer saves new file
   ↓
Database updated with new image URL
   ↓
Old image deleted
```

The old image is retrieved from the existing database record rather than trusting a client-provided path.

---

## 🖼️ Image Uploads

Multer handles uploaded images.

Uploaded images are served through Express static middleware:

```ts
app.use("/images", express.static(...));
```

Images are referenced by URLs such as:

```text
/images/1723456789-example.jpg
```

When replacing an existing post image, the backend:

1. Finds the existing post.
2. Stores the old image URL.
3. Updates the database.
4. Deletes the old image from disk.
5. Returns the updated post.

The database update happens **before** deleting the old image to avoid deleting the existing image if the database update fails.

---

## ⚠️ Error Handling

The backend uses a custom `AppError` class for application-level errors.

Example:

```ts
throw new AppError("Couldn't find the post.", 404);
```

Controllers forward errors to Express:

```ts
catch (err) {
    next(err);
}
```

A centralized error-handling middleware is responsible for converting errors into HTTP responses.

This keeps controllers from having to duplicate error-response logic.

---

## ✅ Validation

Request validation is being implemented using **Zod**.

Schemas define the expected structure of incoming data rather than relying solely on TypeScript types.

For example:

```ts
const createPostSchema = z.object({
    title: z.string(),
    content: z.string()
});
```

TypeScript types can then be inferred from schemas:

```ts
type CreatePostInput = z.infer<typeof createPostSchema>;
```

This provides both runtime validation and compile-time type safety.

---

## 🗄️ Database

The project uses **Prisma** as its ORM with MySQL.

Prisma is responsible for:

* Querying posts
* Creating posts
* Updating posts
* Counting posts
* Loading relationships
* Selecting only required fields

For example, when checking whether a post exists, only the fields required by the operation can be selected:

```ts
const post = await prisma.post.findUnique({
    where: {
        id: postId
    },
    select: {
        id: true,
        imageUrl: true
    }
});
```

This avoids unnecessarily retrieving the entire record.

---

## 🧱 Service Layer

Database operations are kept inside services instead of directly inside controllers.

For example:

```text
postController
      │
      ▼
updatePostService()
      │
      ├── validate operation
      ├── find existing post
      ├── update database
      └── clean up old image
```

This makes the controller primarily responsible for translating HTTP requests into service calls.

---

## 🧪 Development

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run the development server according to the project's configured npm scripts.

---

## 🔐 Environment Variables

Sensitive configuration should be stored in environment variables rather than committed to Git.

Typical configuration includes:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=8080
```

Do not commit `.env` files containing real credentials.

---

## 🗺️ Roadmap

### Backend

* [ ] Complete CRUD operations
* [ ] Authentication
* [ ] Password hashing
* [ ] JWT/session strategy
* [ ] Authorization
* [ ] Post ownership checks
* [ ] Better request validation
* [ ] Pagination
* [ ] Filtering/search
* [ ] Rate limiting
* [ ] Production logging
* [ ] Automated tests
* [ ] API documentation

### File Storage

The current implementation stores images locally.

Future production storage can use:

* Amazon S3
* Cloudflare R2
* Cloudinary

This would allow the application to scale beyond a single server filesystem.

### Frontend

* [ ] Modernize React architecture
* [ ] Connect all pages to the new API
* [ ] Improve loading/error states
* [ ] Modernize routing
* [ ] Improve post editing
* [ ] Authentication integration
* [ ] Better API abstraction

---

## 🎯 Architecture Goals

The long-term goal is to turn Message Node into a maintainable full-stack application with:

* Strong TypeScript typing
* Runtime validation
* Clean separation of concerns
* Centralized error handling
* Secure authentication and authorization
* Scalable database access
* Reliable file storage
* Testable business logic
* Production-ready API design

The project is intentionally being developed incrementally, with the backend architecture being improved rather than simply reproducing the original application's implementation.

---

## 📄 License

This project is currently a personal learning/development project.
