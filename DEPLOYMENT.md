# Deployment

This project can be deployed with Vercel (frontend), Render (API), and a hosted
PostgreSQL database.

## 1. Deploy the API to Render

1. In Render, create a new Blueprint from this GitHub repository and select
   `render.yaml`.
2. Set `DATABASE_URL` to the connection string for the existing PostgreSQL
   database. Keep it private; do not commit it to the repository.
3. After creating the Vercel site in the next section, set `FRONTEND_ORIGIN` to
   its exact `https://` origin (without a path).
4. Deploy the service. Render generates `JWT_SECRET` automatically.
5. Confirm the service health check passes at `/api/health`.

The database must already contain the tables expected by the API. This
repository does not currently include database migrations or a schema setup
script.

## 2. Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel.
2. Set the project Root Directory to `frontend`.
3. Add the environment variable `VITE_API_URL` with the full API base URL,
   including `/api` (for example, `https://your-api.onrender.com/api`).
4. Deploy the project. `frontend/vercel.json` sends app routes to the React
   application so direct navigation works.
5. Update Render's `FRONTEND_ORIGIN` with the deployed site's origin and
   redeploy the API if needed.

For local development, the frontend continues to use `http://localhost:5000/api`
when `VITE_API_URL` is not set.
