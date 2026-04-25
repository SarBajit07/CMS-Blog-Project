# The Intellectual Archive (MiniCMS)

A highly minimalist, editorial-style full-stack blog platform designed for deep reading and focused writing. It rejects the noise of modern interfaces in favor of pure, structural clarity inspired by traditional print broadsheets.

## Features

- **Editorial Design System**: Strictly monochrome palette, sharp corners, and high-contrast typography (serif headlines, sans-serif body).
- **Secure Authentication**: Robust JWT-based authentication system utilizing short-lived access tokens and HTTP-only refresh cookies to prevent XSS and CSRF attacks.
- **Next.js Frontend**: Blazing fast React server components and clean routing.
- **Node.js/Express Backend**: A structured REST API handling user management and editorial content.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- Tailwind CSS (Custom "Modern Broadsheet" configuration)
- Lucide Icons

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT) for Auth
- SQL Database (via standard node drivers)

## Getting Started

### Prerequisites
- Node.js (v18+)
- SQL Database

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend directory with your database and JWT secrets:
   ```env
   PORT=5000
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   # Add database connection details here
   ```
4. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the development server: `npm run dev`

## Design Philosophy

This project actively avoids "app-like" trends—no glowing blurs, no rounded corners, and no heavy drop shadows. Everything is anchored by solid `1px` black lines, vast negative space, and typographic authority.

## License

MIT License
