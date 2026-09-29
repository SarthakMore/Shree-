# Free-Tier Deployment

This project has a Vite/React frontend, an Express API, and a MongoDB database. A simple free-tier layout is Vercel for the frontend, Render for the API, and MongoDB Atlas for the database. Provider free-tier limits can change.

## 1. Create the database

Create a free MongoDB Atlas cluster and a database user. In Atlas Network Access, allow connections from Render (Atlas's `0.0.0.0/0` option is the simple free-tier setup; use a strong database password). Keep the connection string private.

## 2. Deploy the API to Render

Create a Render Blueprint from this repository and use the included `render.yaml`, or create a Web Service with:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Plan: Free

Set `MONGO_URI` to the Atlas connection string and `FRONTEND_URL` to the exact Vercel site origin, for example `https://your-site.vercel.app`. Multiple allowed origins can be comma-separated. The health endpoint is `/api/health`.

## 3. Deploy the frontend to Vercel

Import the repository and set the project root directory to `frontend`. Vercel should detect Vite; use `npm run build` and `dist` if it asks for build settings. Set `VITE_API_URL` to the Render service origin, for example `https://shree-venkateshwara-api.onrender.com`, without a trailing slash. Redeploy after setting the variable.

## 4. Local development

The Vite development server proxies `/api` to `http://localhost:5000`. Leave `VITE_API_URL` unset locally, start the backend with `npm start` from `backend`, and run `npm run dev` from `frontend`.

## Before using real customer data

The current admin PIN is hardcoded as `0000`, and admin API operations are not authenticated. Do not publish the admin portal for real bookings until authentication and authorization are implemented. Also verify MongoDB connects successfully; the backend otherwise falls back to non-persistent in-memory data.