# Deployment

Pustak uses Vercel for the frontend, Render for the API, and Neon for hosted
PostgreSQL. The current production URLs are:

- Frontend: <https://pustak-frontend.vercel.app>
- API: <https://pustak-api-vo21.onrender.com>

## Render API

The Render Blueprint is defined in `render.yaml`. Configure these environment
variables on the `pustak-api` service:

- `DATABASE_URL`: Neon pooled PostgreSQL connection string.
- `JWT_SECRET`: a private, randomly generated secret. Render can generate it.
- `FRONTEND_ORIGIN`: the frontend's exact HTTPS origin, without a trailing
  slash or path.

The API health endpoint is `/api/health`. Render is configured to use it as
the service health check.

## Neon database schema

The initial schema is versioned in `backend/schema.sql`. To apply it, provide
`DATABASE_URL_UNPOOLED` as a direct, non-pooled PostgreSQL connection string in
the root `.env.local` or `backend/.env`, then run:

```sh
npm --prefix backend run db:setup
```

The setup script requires a direct connection and is safe to run again. The API
itself uses the pooled `DATABASE_URL`. Keep both connection strings private and
out of source control.

## Vercel frontend

The Vercel project is connected to this GitHub repository and configured with
Root Directory `frontend`, build command `npm run build`, and output directory
`dist`. Its `frontend/vercel.json` rewrites application routes to the React
application so direct navigation works.

Set `VITE_API_URL` in the Vercel Production and Preview environments to:

```text
https://pustak-api-vo21.onrender.com/api
```

After changing a Vercel environment variable, redeploy the frontend for the
change to take effect. For automatic deployments, push changes to the connected
GitHub repository.

## Deployment order

1. Ensure the Neon schema is applied.
2. Configure `DATABASE_URL` and `JWT_SECRET` in Render, then deploy the API.
3. Configure `VITE_API_URL` in Vercel, then deploy the frontend.
4. Set Render's `FRONTEND_ORIGIN` to `https://pustak-frontend.vercel.app` and
   redeploy the API.
5. Verify the frontend and API health endpoint in a browser.

For local development commands and prerequisites, see [README.md](./README.md).
