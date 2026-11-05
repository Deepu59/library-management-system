# Pustak Library Management System

Pustak is a library management web app for browsing books, managing members,
and tracking book issues, returns, and due dates.

## Live application

- Frontend: [https://pustak-frontend.vercel.app](https://pustak-frontend.vercel.app)
- Backend health: [https://pustak-api-vo21.onrender.com/api/health](https://pustak-api-vo21.onrender.com/api/health)

The frontend is hosted on Vercel, the Express API on Render, and application
data in PostgreSQL on Neon.

## Features

- Public home, About, and Contact pages
- Account registration and sign-in
- Role-based access for members, staff, and administrators
- Book catalogue and member management
- Book issue and return tracking
- Member borrowing history and due-date alerts

New self-registered accounts have the `member` role. Staff and administrator
accounts must be provisioned by an administrator.

## Technology

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: PostgreSQL (Neon), accessed with `pg`
- Authentication: JWT and bcrypt

## Local development

Requirements: Node.js and npm.

1. Install dependencies:

   ```sh
   npm --prefix backend ci
   npm --prefix frontend ci
   ```

2. Configure backend environment variables in `backend/.env`:

   ```env
   PORT=5000
   DATABASE_URL=your_pooled_postgresql_connection_string
   JWT_SECRET=your_long_random_secret
   ```

   Keep connection strings and secrets private. For local Neon development,
   the backend also loads the root `.env.local` file first, if present. Existing
   environment variables take precedence over values in local env files.

3. If the database has not been initialized, provide a direct PostgreSQL
   connection as `DATABASE_URL_UNPOOLED` in the root `.env.local` or
   `backend/.env`, then apply the schema:

   ```sh
   npm --prefix backend run db:setup
   ```

4. Start the API and frontend in separate terminals:

   ```sh
   npm --prefix backend run dev
   ```

   ```sh
   npm --prefix frontend run dev
   ```

   The frontend uses `http://localhost:5000/api` by default. To use a different
   API, set `VITE_API_URL` in the frontend environment (include the `/api`
   suffix).

5. In another terminal, build the frontend:

   ```sh
   npm run build
   ```

The API health endpoint is `http://localhost:5000/api/health`.

## Deployment

The frontend and API are deployed separately. See [DEPLOYMENT.md](./DEPLOYMENT.md)
for the Vercel, Render, and database configuration.
