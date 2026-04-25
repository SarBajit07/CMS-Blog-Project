# Mini CMS Blog Platform — Backend API

This is the Node.js/Express backend for the Mini CMS Blog Platform. It provides a RESTful API to manage users, blog posts, and authentication.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Raw SQL via `pg` Pool)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: `express-validator`
- **Documentation**: Swagger UI (`swagger-jsdoc` + `swagger-ui-express`)

## Folder Structure

The application strictly follows an MVC-like, feature-separated architecture:

```text
backend/
├── config/            # Configuration files (Database setup, Swagger options)
├── controllers/       # Business logic for handling requests and responses
├── middlewares/       # Express middlewares (Auth, Validation, Error Handling)
├── models/            # Database access layer (Raw SQL queries using pg Pool)
├── routes/            # Route definitions and mapping to controllers
├── sql/               # Raw SQL files (Schema definitions and migrations)
├── utils/             # Helper functions (JWT token generators, response formatters)
├── .env               # Environment variables (Ignored in Git)
└── server.js          # Main application entry point (No business logic)
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Database Setup
Create a PostgreSQL database and run the schema script.

```bash
psql -U postgres -d your_db_name -f sql/schema.sql
```

### 2. Environment Variables
Create a `.env` file in the root of the `backend` directory:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/your_db_name
JWT_ACCESS_SECRET=your_super_secret_access_token_key
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
ALLOWED_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Installation
Install all dependencies.

```bash
npm install
```

### 4. Running the Server

Start the development server with hot-reloading:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

## API Documentation (Swagger)

Once the server is running, interactive API documentation is available via Swagger UI.

Navigate to: `http://localhost:5000/api-docs`

This interface allows you to view all available endpoints, their expected payloads, and even test them directly from your browser. (Note: For protected routes, you will need to log in via `/api/auth/login`, copy the `accessToken`, and paste it into the "Authorize" button at the top of the Swagger UI).

## Core Concepts & Rules Followed

1. **No ORM**: All database interactions are written in raw SQL inside the `/models` directory to ensure full control over queries and performance.
2. **Centralized Error Handling**: Errors thrown in controllers are caught by the `errorMiddleware.js`, ensuring the API never crashes or returns raw stack traces in production.
3. **Response Standardization**: All API responses pass through `utils/responseHelper.js` to guarantee a consistent `{ success, message, data }` JSON structure.
4. **Security First**: 
   - Passwords hashed with `bcrypt`.
   - Access tokens have a short lifespan (15m).
   - Sensitive routes require role-based authorization (`admin` vs `author`).
