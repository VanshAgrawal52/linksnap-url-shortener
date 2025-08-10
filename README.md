# LinkSnap – URL Shortener

LinkSnap is a minimalist, modern URL shortener built with a React + Vite + Tailwind CSS frontend and an Express + MongoDB backend. It lets users quickly shorten long URLs and copy the result with one click.

## Features

- React (Vite) frontend with TailwindCSS, fully responsive and mobile‑first
- Clean form with validation, loading states, and error feedback
- Copy-to-clipboard interaction with subtle animations
- Express REST API: shorten URL + redirect via short code
- MongoDB persistence, nanoid for collision-resistant short codes
- Click counter stored in DB (increments on redirect)
- Optional custom alias for branded links (validated & uniqueness enforced)
- Optional expiration (minutes, TTL index auto-deletes after expiry)
- Basic rate limiting (30 shorten requests / 10 min per IP)
- Structured error handling & CORS enabled
- Environment-based configuration; deploy-ready for Vercel (frontend) + Render (backend)

## Tech Stack

Frontend: React 18, Vite, TailwindCSS, Fetch API

Backend: Node.js, Express, MongoDB (Mongoose), nanoid, dotenv, cors, morgan, helmet, compression

## Project Structure

```
frontend/       # Vite + React app
backend/        # Express API server
```

## Environment Variables

Backend (`backend/.env`):

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/linksnap
PORT=5000
BASE_URL=http://localhost:5000
FRONTEND_ORIGIN=http://localhost:5173
```

Frontend (`frontend/.env`):

```
VITE_API_BASE_URL=http://localhost:5000
```

## Local Development

1. Clone repo & install dependencies:

```powershell
cd "LinkSnap - URL Shortener"; cd backend; npm install; cd ../frontend; npm install
```

2. Create `.env` files (copy from provided examples) and set values.

3. Start backend (port 5000 default):

```powershell
cd backend; npm run dev
```

4. In a new terminal, start frontend (Vite default 5173):

```powershell
cd frontend; npm run dev
```

5. Open the app: http://localhost:5173

### Docker (optional all-in-one)

With Docker + docker-compose installed:

```
docker compose up --build
```

Services:
- API: http://localhost:5000
- Frontend (static build via Nginx): http://localhost:8080
- MongoDB: localhost:27017


## API Endpoints

POST `/api/shorten`

Request body JSON (POST /api/shorten):
```json
{
  "url": "https://example.com/some/long/link",
  "alias": "my-brand",          // optional custom path (3-30 chars, a-z A-Z 0-9 _ -)
  "expireIn": 60                 // optional minutes until expiry (1 - 43200)
}
```
Response example:
```json
{
  "code": "abc1234",
  "alias": "my-brand",
  "shortUrl": "http://localhost:5000/my-brand",
  "originalUrl": "https://example.com/some/long/link",
  "expiresAt": "2025-08-11T10:15:00.000Z"
}
```

GET `/:code` – Redirects (302) to original URL and increments click counter.

### Admin (optional)

Requires `ADMIN_API_KEY` set in backend environment and header `x-api-key: <key>`.

- GET `/api/admin/stats` → `{ totalLinks, totalClicks }`
- DELETE `/api/admin/links/:id` (code or alias) → `{ deleted: true, id }`

## Deployment

### Backend on Render

1. Push repository to GitHub.
2. In Render dashboard: New + Web Service → connect repo.
3. Root directory: `backend`.
4. Build Command: `npm install` (Render auto-detects Node).  
   Start Command: `node server.js`
5. Set Environment Variables (same as `.env`). Ensure `BASE_URL` uses the Render service URL (e.g., `https://linksnap-api.onrender.com`).
6. Deploy. Note the live backend URL.

### Frontend on Vercel

1. Import same GitHub repo in Vercel.
2. Root directory: `frontend`.
3. Framework: Vite.
4. Environment Variable: `VITE_API_BASE_URL` set to the deployed backend URL (e.g., `https://linksnap-api.onrender.com`).
5. Deploy.

### (Optional) Single-Domain Redirect

Configure a reverse proxy or edge function to forward `/{code}` paths from the frontend domain to the backend redirect endpoint. Simpler: DNS CNAME `api` subdomain → backend service, and user-facing domain uses frontend only.

## Testing Tips

- Try an invalid URL (e.g., `abc`) → client validation error.
- Try a valid URL; ensure result card appears, copy button copies correctly.
- Visit the short URL in a new tab → should redirect.

## Future Enhancements (Not implemented yet)

- Auth + dashboards with click analytics
- Bulk link import
- QR code generation
- Per-link access tokens / deletion

## License

MIT (add a LICENSE file if distributing publicly).

---
Enjoy shortening with LinkSnap!
