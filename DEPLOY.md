# Free-Tier Deployment

The root multi-page site and Express API are hosted on Render. MongoDB Atlas stores persistent booking and settings data.

## Render Services

The root `render.yaml` defines both services. In Render, create or sync the Blueprint for this repository and branch `main`:

- `shree-website`: static site built from the root HTML, CSS, JavaScript, and images.
- `shree-venkateshwara-api`: Node web service built from `backend/`.

The current public site is `https://shree-website-93o4.onrender.com` and the API is `https://shree-venkateshwara-api.onrender.com`. Render may assign a different suffix if the static service is recreated; update `FRONTEND_URL` in `render.yaml` if that happens.

## MongoDB Atlas

Create an Atlas database user with `readWrite` access to `anandyatra_db`. Render's free service has dynamic outbound IPs, so the simple setup is to allow `0.0.0.0/0` in Atlas Network Access. This permits connections from any IP; keep the database password strong and unique, and use the limited database role above.

Render needs `MONGO_URI` set to the Atlas connection string. Keep it only in Render's private environment settings, never in source control or chat.

## Admin Access

Render generates and stores `ADMIN_PASSWORD` privately for the API. To sign in, reveal it in the API service's Environment settings; do not commit it or send it in chat. Admin sessions expire after eight hours and are revoked when the user logs out or the service restarts.

Admin booking and quote data, settings updates, fleet edits, and tour edits require a valid admin session. Customer booking and quote submissions remain public.

## Local Development

The root static site build can be generated with `node scripts/build-static-site.js`. It uses `API_BASE_URL` if set, otherwise it targets `http://localhost:5000`.

Run the API with `npm start` from `backend`. Set `MONGO_URI` and `ADMIN_PASSWORD` in the local environment before testing persistent data or admin login.