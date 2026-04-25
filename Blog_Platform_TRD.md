# Blog Platform (Mini CMS)
## Technical Requirements Document

**Version:** 1.0  
**Status:** Draft  
**Date:** April 22, 2026  
**Stack:** Next.js 14 · Node.js + Express · PostgreSQL · REST API · JWT Auth

---

## Table of Contents

1. [Project Overview](#1-project-overview)
   - 1.1 [Purpose & Scope](#11-purpose--scope)
   - 1.2 [Goals & Success Criteria](#12-goals--success-criteria)
2. [System Architecture](#2-system-architecture)
   - 2.1 [Architecture Overview](#21-architecture-overview)
   - 2.2 [Technology Stack](#22-technology-stack)
3. [Database Design](#3-database-design)
   - 3.1 [Entity Relationship Summary](#31-entity-relationship-summary)
   - 3.2 [Table Schemas](#32-table-schemas)
4. [Backend — Node.js / Express API](#4-backend--nodejs--express-api)
   - 4.1 [Project Structure](#41-project-structure)
   - 4.2 [Authentication & Authorization](#42-authentication--authorization)
   - 4.3 [API Endpoints](#43-api-endpoints)
   - 4.4 [Middleware & Error Handling](#44-middleware--error-handling)
5. [Frontend — Next.js 14](#5-frontend--nextjs-14)
   - 5.1 [App Router Structure](#51-app-router-structure)
   - 5.2 [Pages & Components](#52-pages--components)
   - 5.3 [State Management & Data Fetching](#53-state-management--data-fetching)
6. [Security Requirements](#6-security-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Development Workflow & Conventions](#8-development-workflow--conventions)
9. [Deployment Overview](#9-deployment-overview)
10. [Glossary](#10-glossary)

---

## 1. Project Overview

### 1.1 Purpose & Scope

This document defines the complete technical requirements for building a **Blog Platform (Mini CMS)** — a full-stack web application that lets registered authors create, edit, and publish blog posts, while readers can browse and read content without an account. It is intended as a learning project for developers familiar with frontend (React/Next.js) who want to understand backend architecture with Node.js, Express, and PostgreSQL.

**In scope:**
- User authentication (register / login / logout) using JWT
- CRUD operations for blog posts with rich-text body (stored as HTML)
- Category and tag management
- Comment system (authenticated users can comment; authors can moderate)
- Image upload for post cover images (stored locally or via cloud)
- Public-facing blog listing and detail pages
- Admin dashboard for authors to manage their own content

**Out of scope (v1):**
- Payment / subscription
- Email newsletter
- Real-time features (WebSockets)

---

### 1.2 Goals & Success Criteria

| ID | Goal | Success Criteria |
|----|------|-----------------|
| G-01 | Performance | Public blog pages load in < 2s on a 4G connection (Next.js SSG/ISR) |
| G-02 | Security | No unauthenticated user can create / modify / delete content |
| G-03 | Scalability | Database schema supports future multi-author workspaces |
| G-04 | DX | API fully documented; new endpoint added in < 30 min by a junior developer |
| G-05 | Reliability | 99% uptime target; graceful error responses (never raw stack traces) |

---

## 2. System Architecture

### 2.1 Architecture Overview

The system follows a classic **three-tier architecture**: presentation tier (Next.js), application/logic tier (Express REST API), and data tier (PostgreSQL). The two backend services communicate over HTTP/JSON; the database is never directly reachable from the browser.

```
[ Browser / Mobile ]  ←→  [ Next.js 14 — Port 3000 ]
                                    ↕  fetch / axios (REST)
                       [ Express API — Port 5000 ]
                                    ↕  pg / node-postgres
                       [ PostgreSQL — Port 5432 ]
```

---

### 2.2 Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 14 (App Router) | React 18, TypeScript, Tailwind CSS |
| Backend | Node.js 20 LTS + Express 4 | REST API, MVC pattern |
| Database | PostgreSQL 16 | Relational; managed via node-postgres (pg) |
| Auth | JSON Web Tokens (JWT) | Access token (15 min) + Refresh token (7 days) |
| File Storage | Local /uploads (v1) | Can swap to AWS S3 / Cloudinary later |
| Dev Tools | ESLint, Prettier, Nodemon | Consistent code style + hot reload |
| Testing | Jest + Supertest | Unit & integration tests for API routes |
| Deployment | Railway / Render (API), Vercel (Next.js) | Free tier friendly |

---

## 3. Database Design

### 3.1 Entity Relationship Summary

Six core tables cover all functional requirements. Foreign key constraints enforce referential integrity at the database level — the application layer must never skip these checks.

| Table | Responsibility |
|-------|---------------|
| users | Stores author/admin accounts. One user → many posts & comments |
| posts | Core content table. Belongs to one user (author). Many categories via junction |
| categories | Flat list of topics (e.g., Tech, Travel). Posts can have many categories |
| post_categories | Junction table — resolves posts ↔ categories (M:M) |
| tags | Free-form keywords. Posts can have many tags |
| post_tags | Junction table — resolves posts ↔ tags (M:M) |
| comments | Threaded comments on posts. Belongs to a post and a user |
| media | Uploaded images metadata (filename, mimetype, size, uploader) |

---

### 3.2 Table Schemas

#### Table: `users`

| Column | Type / Constraint | Notes |
|--------|------------------|-------|
| id | SERIAL PRIMARY KEY | |
| username | VARCHAR(50) | UNIQUE NOT NULL |
| email | VARCHAR(255) | UNIQUE NOT NULL |
| password_hash | TEXT | NOT NULL (bcrypt, cost 12) |
| role | VARCHAR(20) | DEFAULT 'author' — enum: author, admin |
| avatar_url | TEXT | NULLABLE |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### Table: `posts`

| Column | Type / Constraint | Notes |
|--------|------------------|-------|
| id | SERIAL PRIMARY KEY | |
| author_id | INTEGER | FK → users(id) ON DELETE CASCADE |
| title | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(300) | UNIQUE NOT NULL (URL-safe) |
| excerpt | TEXT | Short summary (~160 chars) |
| body | TEXT | HTML content from rich-text editor |
| cover_image_url | TEXT | NULLABLE |
| status | VARCHAR(20) | DEFAULT 'draft' — enum: draft, published, archived |
| published_at | TIMESTAMPTZ | NULLABLE — set when status → published |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### Table: `categories`

| Column | Type / Constraint | Notes |
|--------|------------------|-------|
| id | SERIAL PRIMARY KEY | |
| name | VARCHAR(100) | UNIQUE NOT NULL |
| slug | VARCHAR(120) | UNIQUE NOT NULL |
| description | TEXT | NULLABLE |

#### Table: `comments`

| Column | Type / Constraint | Notes |
|--------|------------------|-------|
| id | SERIAL PRIMARY KEY | |
| post_id | INTEGER | FK → posts(id) ON DELETE CASCADE |
| author_id | INTEGER | FK → users(id) ON DELETE SET NULL |
| parent_id | INTEGER | FK → comments(id) NULLABLE (threaded) |
| body | TEXT | NOT NULL (max 2000 chars enforced in API) |
| is_approved | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

> **Indexes to create:** `posts(slug)`, `posts(author_id)`, `posts(status, published_at DESC)`, `comments(post_id)`, `users(email)`

---

## 4. Backend — Node.js / Express API

### 4.1 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js          ← pg Pool setup
│   │   └── env.js         ← dotenv validation (envalid)
│   ├── middleware/
│   │   ├── auth.js        ← verifyToken, requireRole
│   │   ├── errorHandler.js
│   │   ├── upload.js      ← multer config
│   │   └── validate.js    ← express-validator wrapper
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── posts/
│   │   │   ├── posts.routes.js
│   │   │   ├── posts.controller.js
│   │   │   └── posts.service.js
│   │   ├── comments/
│   │   ├── categories/
│   │   ├── tags/
│   │   └── media/
│   ├── utils/
│   │   ├── slugify.js
│   │   ├── paginate.js
│   │   └── jwt.js
│   └── app.js             ← Express app factory
├── migrations/            ← SQL migration files
├── seeds/                 ← Dev seed data
├── tests/
├── .env.example
└── server.js              ← Entry point
```

---

### 4.2 Authentication & Authorization

Authentication uses **JWT with a dual-token strategy**. The **Access Token** (15 min TTL) is sent in the Authorization header (`Bearer <token>`). The **Refresh Token** (7-day TTL) is stored in an HTTP-only, Secure, SameSite=Strict cookie and used to silently rotate access tokens. Passwords are hashed with **bcrypt (cost factor 12)**.

| Role | Permissions |
|------|------------|
| guest | Read published posts, read approved comments |
| author | All guest permissions + create/edit/delete own posts & comments |
| admin | All author permissions + manage users, all posts, categories, tags |

---

### 4.3 API Endpoints

#### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | guest | Register new user |
| POST | /api/auth/login | guest | Login → returns tokens |
| POST | /api/auth/refresh | cookie | Rotate access token |
| POST | /api/auth/logout | author | Invalidate refresh token |

#### Posts

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/posts | guest | List published posts (paginated, filterable) |
| GET | /api/posts/:slug | guest | Get single post by slug |
| POST | /api/posts | author | Create draft post |
| PUT | /api/posts/:id | author* | Update post (* own post or admin) |
| DELETE | /api/posts/:id | author* | Soft-delete post |
| PATCH | /api/posts/:id/publish | author* | Change status to published |

#### Comments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/posts/:postId/comments | guest | List approved comments |
| POST | /api/posts/:postId/comments | author | Add comment |
| DELETE | /api/comments/:id | author* | Delete own comment or admin |
| PATCH | /api/comments/:id/approve | admin | Approve / hide comment |

#### Categories & Tags

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/categories | guest | List all categories |
| POST | /api/categories | admin | Create category |
| GET | /api/tags | guest | List all tags |
| POST | /api/tags | author | Create tag (auto-create on post save) |

#### Media

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/media/upload | author | Upload image (multipart/form-data) |
| DELETE | /api/media/:id | admin | Delete media record & file |

#### Users (Admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/users | admin | List users (paginated) |
| PATCH | /api/users/:id/role | admin | Change user role |
| DELETE | /api/users/:id | admin | Deactivate user account |

---

### 4.4 Middleware & Error Handling

| Middleware | Purpose |
|-----------|---------|
| cors | Allows requests from Next.js origin only (env-configured) |
| helmet | Sets secure HTTP headers (XSS protection, no-sniff, etc.) |
| express-rate-limit | 100 req/15 min on /api/auth/*; 300 req/15 min elsewhere |
| morgan | HTTP request logger (combined format in production) |
| express-validator | Input validation on every mutation endpoint; returns 422 on failure |
| errorHandler.js | Central error middleware — formats all errors as `{ error, message, code }` |

---

## 5. Frontend — Next.js 14

### 5.1 App Router Structure

```
frontend/
├── app/
│   ├── layout.tsx              ← Root layout (Navbar, Footer)
│   ├── page.tsx                ← Home / Blog listing (SSG + ISR 60s)
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx        ← Post detail (SSG generateStaticParams)
│   │   └── category/[slug]/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── dashboard/              ← Protected (middleware.ts)
│       ├── layout.tsx
│       ├── page.tsx            ← Stats overview
│       ├── posts/
│       │   ├── page.tsx        ← My posts list
│       │   ├── new/page.tsx    ← Create post
│       │   └── [id]/edit/page.tsx
│       └── comments/page.tsx   ← Moderate comments
├── components/
│   ├── ui/                     ← Button, Input, Badge, Modal …
│   ├── blog/                   ← PostCard, PostList, CommentThread …
│   └── dashboard/              ← PostForm, RichTextEditor …
├── lib/
│   ├── api.ts                  ← Axios instance with interceptors
│   ├── auth.ts                 ← Token helpers
│   └── hooks/                  ← useAuth, usePosts, useComments
├── middleware.ts               ← Route protection (JWT cookie check)
└── public/
```

---

### 5.2 Pages & Components

| Route | Rendering | Key UI Elements |
|-------|-----------|----------------|
| / (Home) | SSG + ISR | Latest posts grid, category filter sidebar |
| /blog/[slug] | SSG + ISR | Post content, author card, comment thread |
| /auth/login | CSR | Login form with client-side validation |
| /auth/register | CSR | Registration form |
| /dashboard | SSR (auth) | Author stats — total posts, comments, views |
| /dashboard/posts | SSR (auth) | Data table of author's posts with actions |
| /dashboard/posts/new | CSR (auth) | Rich-text editor (Tiptap), tag/category pickers |
| /dashboard/posts/[id]/edit | SSR (auth) | Pre-filled editor for updating post |
| /dashboard/comments | SSR (auth) | Comment moderation table |

---

### 5.3 State Management & Data Fetching

Public pages use Next.js **Server Components** with fetch (cached). Protected dashboard pages use **SWR** for client-side data fetching with optimistic updates. Global auth state is managed via React Context + `useReducer`. The Axios instance in `lib/api.ts` automatically attaches the access token and handles 401 → refresh token rotation transparently.

---

## 6. Security Requirements

| ID | Requirement | Implementation Note |
|----|------------|-------------------|
| SEC-01 | Password hashing | bcrypt with cost factor ≥ 12. Never store plaintext |
| SEC-02 | JWT secret | ≥ 256-bit random string stored in env; rotated on breach |
| SEC-03 | CORS | Whitelist only the Next.js origin. No wildcard in production |
| SEC-04 | SQL injection | Always use parameterized queries with pg ($1, $2 …). No raw string concat |
| SEC-05 | XSS | Sanitize HTML body with DOMPurify before saving; Helmet CSP headers |
| SEC-06 | File upload | Validate MIME type & size (max 5 MB). Store outside web root |
| SEC-07 | Rate limiting | Auth endpoints: 10 req/15 min. Global: 300 req/15 min |
| SEC-08 | HTTPS | Enforced in production. Cookies: Secure + HttpOnly + SameSite=Strict |
| SEC-09 | Dependency audit | Run `npm audit` before every release. No known critical CVEs |

---

## 7. Non-Functional Requirements

| ID | Category | Requirement |
|----|---------|------------|
| NFR-01 | Performance | API p95 latency < 200ms under 100 concurrent users |
| NFR-02 | Page Speed | Next.js public pages > 90 Lighthouse score (mobile) |
| NFR-03 | Availability | 99% uptime per month (≈ 7.3h downtime tolerance) |
| NFR-04 | Scalability | DB schema + API designed to support 10× current load without redesign |
| NFR-05 | Maintainability | Code coverage ≥ 70% for API modules. ESLint/Prettier enforced in CI |
| NFR-06 | Accessibility | WCAG 2.1 AA compliance for all public-facing pages |
| NFR-07 | SEO | All public pages have meta title, description, og:image via Next.js Metadata API |
| NFR-08 | Mobile | Responsive layout; all dashboard features usable on 375px viewport |

---

## 8. Development Workflow & Conventions

### Branching Strategy

Use **GitHub Flow**: one `main` branch (always deployable) + feature branches named `feat/<short-description>`. Open a Pull Request; at least one review required before merge. No direct pushes to main.

### Environment Variables

| Variable | Service | Description |
|---------|---------|-------------|
| DATABASE_URL | Backend | PostgreSQL connection string |
| JWT_ACCESS_SECRET | Backend | Secret for signing access tokens |
| JWT_REFRESH_SECRET | Backend | Secret for signing refresh tokens |
| PORT | Backend | Express listen port (default 5000) |
| NEXT_PUBLIC_API_URL | Frontend | Base URL of the Express API |
| ALLOWED_ORIGIN | Backend | CORS whitelist (Next.js URL) |
| NODE_ENV | Both | development \| production \| test |

### Commit Message Convention (Conventional Commits)

- `feat:` a new feature
- `fix:` a bug fix
- `docs:` documentation only changes
- `refactor:` code change that neither fixes a bug nor adds a feature
- `test:` adding or fixing tests
- `chore:` build process or tooling changes

---

## 9. Deployment Overview

### Recommended Free-Tier Stack

| Component | Platform | Notes |
|-----------|---------|-------|
| Next.js (Frontend) | Vercel | Push to main → auto-deploy. Set NEXT_PUBLIC_API_URL |
| Express API (Backend) | Railway or Render | Connect GitHub repo. Add env vars. Free 750h/mo |
| PostgreSQL | Railway (managed) or Neon.tech | Free managed Postgres. Copy DATABASE_URL to backend |
| Media / Images | Cloudinary (free tier) | Replace local storage; set CLOUDINARY_URL env var |

### Production Checklist

- [ ] `NODE_ENV=production` set on all services
- [ ] HTTPS enforced; HTTP → HTTPS redirect enabled
- [ ] Database backups enabled (daily minimum)
- [ ] Error monitoring configured (Sentry free tier)
- [ ] `npm audit` — zero critical vulnerabilities
- [ ] All secrets in environment variables — no `.env` committed to git

---

## 10. Glossary

| Term | Definition |
|------|-----------|
| CMS | Content Management System — software for creating and managing digital content |
| JWT | JSON Web Token — a compact, self-contained token for securely transmitting claims |
| SSG | Static Site Generation — pages are pre-rendered at build time (fast, cacheable) |
| ISR | Incremental Static Regeneration — re-generates static pages in the background |
| SSR | Server-Side Rendering — page is rendered on the server per request |
| CSR | Client-Side Rendering — page rendered entirely in the browser via JavaScript |
| CRUD | Create, Read, Update, Delete — the four basic data operations |
| REST | Representational State Transfer — architectural style for stateless HTTP APIs |
| ORM | Object Relational Mapper — not used here; raw SQL via node-postgres instead |
| Slug | URL-friendly string derived from a title, e.g. `my-first-post` |
| Bcrypt | Adaptive password hashing algorithm; cost factor controls computation time |
| CORS | Cross-Origin Resource Sharing — browser security policy for cross-domain requests |
| Middleware | Functions that run between request and response in the Express pipeline |

---

*Blog Platform (Mini CMS) — TRD v1.0 · Confidential*
