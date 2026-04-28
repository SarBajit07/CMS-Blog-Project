# CMS Blog Platform: Future Works Implementation Plan

This document outlines the remaining features, tasks, and phases to transition the CMS Blog platform from its current state into a fully featured, production-ready system. 

---

## 1. Superadmin Dashboard & Taxonomy Management
*Currently, the backend APIs support creating, updating, and deleting categories and tags, but there is no UI to manage them.*

### Backend Tasks:
- Ensure all category/tag mutation endpoints are strictly protected by `superadmin` role middleware.
- (Optional) Add pagination and search to the `GET /api/categories` and `GET /api/tags` endpoints for scalability.

### Frontend Tasks:
- Create a `/dashboard/admin/categories` page to list all categories.
- Build a form/modal to Create, Edit, and Delete categories.
- Create a `/dashboard/admin/tags` page with similar CRUD capabilities.
- Create a `/dashboard/admin/users` page for superadmins to view registered users and change their roles (e.g., promote an author to superadmin).

---

## 2. Comments System
*Allow readers to engage with the published stories.*

### Backend Tasks:
- Create `commentModel.js` and `commentController.js`.
- Endpoints needed:
  - `POST /api/posts/:postId/comments`: Submit a comment.
  - `GET /api/posts/:postId/comments`: Fetch approved comments for a post.
  - `PUT /api/comments/:id/approve`: (Admin) Approve a comment.
  - `DELETE /api/comments/:id`: (Admin or Author) Delete a comment.

### Frontend Tasks:
- Update `/blog/[slug]/page.tsx` to display a comment thread at the bottom of the article.
- Build a "Leave a Comment" form.
- Add a section in the Superadmin Dashboard (`/dashboard/admin/comments`) to moderate (approve/delete) pending comments.

---

## 3. Media & File Uploads (Cover Images & Avatars)
*Currently, images are handled via external URLs. Implementing native file uploads will make the platform robust.*

### Backend Tasks:
- Install and configure `multer`.
- Create a `/api/upload` endpoint.
- Configure local static file serving in Express (`app.use('/uploads', express.static(...))`) OR integrate a cloud provider like AWS S3 / Cloudinary.
- Update `userModel` to support `avatar_url`.

### Frontend Tasks:
- Update the `RichTextEditor` to support dragging and dropping images, uploading them to the backend, and inserting the resulting URL into the content.
- Update the Post Creation/Edit forms to upload files for the `cover_image_url` instead of pasting a plain URL.
- Create a Profile Settings page for users to upload avatars and change passwords.

---

## 4. Frontend Polish & User Experience
*Enhance the existing UI to make it feel premium and performant.*

### Tasks:
- **Search:** Add a global search bar in the navbar that queries posts by title or content.
- **Pagination:** Implement pagination or "Load More" functionality on the Home page (`page.tsx`) and Blog Feed (`/blog/page.tsx`).
- **Loading Skeletons:** Replace the spinner (`<Loader2 />`) with sleek skeleton loaders that match the dimensions of the post cards.
- **Toast Notifications:** Add a global toast notification system (e.g., `react-hot-toast` or `sonner`) for success/error feedback during post creation, login, etc.
- **SEO & Metadata:** Use Next.js `generateMetadata` in `/blog/[slug]/page.tsx` to generate dynamic `<title>` and `<meta>` tags for better search engine indexing and social media sharing.

---

## 5. Deployment & CI/CD
*Get the application live on the web securely.*

### Database Deployment:
- Provision a managed PostgreSQL database (e.g., Neon.tech, Supabase, or AWS RDS).
- Run the schema migrations (`schema.sql`).

### Backend Deployment:
- Deploy the Express API to a platform like Render, Railway, or Heroku.
- Configure production environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`).

### Frontend Deployment:
- Deploy the Next.js app to Vercel.
- Configure the `NEXT_PUBLIC_API_URL` to point to the live Express API.
- Ensure the Next.js cache and revalidation strategies (ISR) are correctly set up to handle new post publications without requiring a full rebuild.
