# Bloggify - A Simple Blogging Platform

A full-stack blog application built with **Next.js (App Router)** and **TypeScript**, using **SQLite** as the database and **Prisma** as the ORM. Users can create, read, update, and delete blog posts through a clean, responsive interface.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Features Implemented](#features-implemented)
- [Bonus Features Implemented](#bonus-features-implemented)
- [Folder Structure](#folder-structure)
- [Design Decisions](#design-decisions)
- [API Reference](#api-reference)
- [Approximate Time Spent](#approximate-time-spent)

---

## Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HeshanChamika100/Bloggify---A-Simple-Blogging-Platform.git
   cd Bloggify---A-Simple-Blogging-Platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-generated-secret-here"
   ```

   To generate a secure JWT secret, run:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Copy the output and paste it as the `JWT_SECRET` value.

4. **Generate Prisma client and run migrations**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features Implemented

### Backend (REST API)

- **`GET /api/posts`** - Retrieve all posts with author details, sorted by newest first
- **`GET /api/post/:id`** - Retrieve a single post by ID, including author information
- **`POST /api/post`** - Create a new blog post (linked to an existing author by email)
- **`PUT /api/post/:id`** - Update the title and/or content of an existing post (JWT-protected, ownership-verified)
- **`DELETE /api/post/:id`** - Delete a post (JWT-protected, ownership-verified)

### Database

- **SQLite** database via Prisma ORM
- Two models with a one-to-many relationship: `Author` (one) → `Post` (many)
- Each author has a unique email, hashed password, and associated posts
- Cascade delete: removing an author deletes all their posts

### Frontend

- **Home / List Page (`/`)** - Displays all posts in a responsive grid with title, author, date, and a content snippet
- **Post Detail Page (`/posts/[id]`)** - Shows the full post content with author information, edit and delete controls for the post owner
- **Create Post Page (`/create`)** - Form with title and content fields; author info is automatically populated from the logged-in user
- **Login Page (`/login`)** - Email and password authentication
- **Signup Page (`/signup`)** - Registration with name, email, and password (minimum 6 characters)

### Validation & Error Handling

- Server-side validation of all required fields (returns `400 Bad Request`)
- `404 Not Found` for non-existent posts
- `401 Unauthorized` for invalid credentials and missing tokens
- `403 Forbidden` when attempting to delete another user's post
- `500 Internal Server Error` as a catch-all for unexpected failures
- Consistent error response format: `{ error: "message" }`

### UI States

- **Loading state** - Skeleton placeholders while data is being fetched (on both list and detail pages)
- **Error state** - Styled error banners when API requests fail
- **Empty state** - Friendly message with icon when no posts exist

### Authentication

- **Signup** - Creates a new author with a bcrypt-hashed password
- **Login** - Validates credentials and issues a JWT stored in an HTTP-only cookie
- **Logout** - Clears the authentication cookie
- **Authorization** - Post updating and deletion is restricted to the post's author via JWT verification and ownership check
- Client-side auth state managed through React Context + localStorage

---

## Bonus Features Implemented

1. **Client-side search/filter** - The home page includes a search bar that filters posts in real time by title or author name.

2. **Skeleton loaders / loading placeholders** - Both the post list page and the post detail page display animated skeleton placeholders while data is being fetched, providing a smooth perceived loading experience.

---

## Folder Structure

```
bloggify/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend REST API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts    # POST  /api/auth/login
│   │   │   ├── signup/route.ts   # POST  /api/auth/signup
│   │   │   └── logout/route.ts   # POST  /api/auth/logout
│   │   ├── post/
│   │   │   ├── route.ts          # POST  /api/post
│   │   │   └── [id]/route.ts     # GET, PUT, DELETE  /api/post/:id
│   │   └── posts/
│   │       └── route.ts          # GET   /api/posts
│   ├── create/page.tsx           # Create post page
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Signup page
│   ├── posts/[id]/page.tsx       # Post detail page
│   ├── page.tsx                  # Home page (post list)
│   ├── layout.tsx                # Root layout with Navbar & AuthProvider
│   └── globals.css               # Global styles and CSS variables
├── components/
│   └── Navbar.tsx                # Navigation bar component
├── context/
│   └── AuthContext.tsx           # React Context for authentication state
├── lib/
│   └── prisma.ts                 # Prisma client singleton
├── types/
│   └── index.ts                  # Shared TypeScript interfaces (Post, Author)
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   └── migrations/               # Database migration history
├── generated/
│   └── prisma/                   # Auto-generated Prisma client
├── .env                          # Environment variables
├── package.json
└── tsconfig.json
```

### Structure Rationale

- **`app/api/`** - Next.js file-based API routing acts as the "routes" layer (App Router). Each route file contains the handler logic for its respective HTTP methods.
- **`app/` (pages)** - Each page lives in its own directory, following Next.js App Router conventions. Pages are client components that handle data fetching, state management, and rendering.
- **`components/`** - Reusable UI components shared across pages.
- **`context/`** - React Context providers for global state (authentication).
- **`types/`** - Centralized TypeScript interfaces used across both frontend pages and API interactions.
- **`lib/`** - Utility modules and shared backend logic (database client).
- **`prisma/`** - Database schema and migration files, kept separate from application code.

---

## Design Decisions

### 1. Next.js App Router for both Frontend and Backend

I chose to use Next.js API routes (`app/api/`) instead of a separate Node.js backend server. This keeps the entire application in a single project, simplifies deployment, and reduces the complexity of managing two servers during development. The API routes still follow RESTful conventions and return proper HTTP status codes.

### 2. SQLite with Prisma ORM

SQLite was chosen for its zero-configuration setup - no external database server is needed. Prisma provides type-safe database access, auto-generated migrations, and a clean API for defining relationships. The `better-sqlite3` adapter was used for synchronous, high-performance SQLite access.

### 3. Authentication with JWT + HTTP-only Cookies

Instead of session-based auth, I used JWTs stored in HTTP-only cookies. This approach:
- Prevents XSS attacks (JavaScript cannot read the cookie)
- Keeps the backend stateless (no session store needed)
- Allows the server to verify identity on protected routes (like post UPDATE & DELETION)

Client-side auth state is managed through React Context and localStorage for UI purposes (showing/hiding edit/delete buttons, displaying the user's name).

### 4. Author Model Separate from Posts

Rather than embedding author information directly in posts (as flat strings), I created a separate `Author` model with a one-to-many relationship to `Post`. This:
- Avoids data duplication (author info is stored once)
- Enables authentication (authors have passwords)
- Allows consistent author data across all their posts
- Supports cascade deletion

### 5. Client-side Search over Server-side

For a small blog application, client-side filtering is simpler and provides instant feedback without additional API requests. The search filters the already-fetched posts array by title and author name in real time.

### 6. TypeScript Approach

- All frontend code uses TypeScript with strict typing
- Shared interfaces (`Post`, `Author`) are centralized in `types/index.ts`
- `any` is avoided throughout - `unknown` is used with type guards for error handling
- Optional chaining (`?.`) is used when accessing potentially undefined nested properties

### 7. Styling with Tailwind CSS

Tailwind CSS was used for rapid development and consistent styling. Custom CSS variables in `globals.css` define the color palette, and utility classes keep component styles co-located with their markup. The design follows a minimal, clean aesthetic with a stone/indigo color scheme.

---

## API Reference

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | List all posts | No |
| GET | `/api/post/:id` | Get a single post | No |
| POST | `/api/post` | Create a new post | No (uses email to link author) |
| PUT | `/api/post/:id` | Update a post | Yes (JWT cookie + ownership) |
| DELETE | `/api/post/:id` | Delete a post | Yes (JWT cookie + ownership) |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in and receive JWT |
| POST | `/api/auth/logout` | Clear auth cookie |

### Example: Create a Post

```bash
curl -X POST http://localhost:3000/api/post \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Hello world!",
    "email": "john@example.com"
  }'
```

### Error Response Format

All error responses follow a consistent structure:

```json
{
  "error": "Descriptive error message"
}
```

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Prisma](https://www.prisma.io/) | ORM and database toolkit |
| [SQLite](https://www.sqlite.org/) | Embedded SQL database |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT authentication |
