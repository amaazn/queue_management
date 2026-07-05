# 🎫 QueueFlow — Full-Stack Queue Management System

A production-ready **MERN** application for managing service queues (Hospital OPD, Bank Counter, Customer Support, etc.). A queue manager can create queues, issue auto-numbered tokens, reorder the waiting line, serve or cancel tokens, and watch live analytics — all from a modern SaaS-style dashboard.

<p>
  <img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Express-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT%20(httpOnly%20cookie)-orange" />
</p>

---

## 📌 Project Overview

QueueFlow is a single-manager queue management tool. After logging in, the manager works with two core concepts:

- **Queues** — a named line of people (e.g. "Hospital OPD").
- **Tokens** — a person in a queue. Each token has an auto-generated **ticket number** and a **position** in the waiting line.

The manager can move people up/down the line, serve the next person (always the front of the line), or cancel a token. A dashboard shows live statistics and 7-day trend charts, all computed from MongoDB.

---

## ✨ Features

- 🔐 **Secure auth** — JWT stored in an **httpOnly cookie** (safe from XSS), bcrypt-hashed passwords, protected routes.
- 📋 **Queue management** — create, list, open, and delete queues (deleting a queue cascades to its tokens).
- 🎟️ **Token management** — add person (auto token number), move up/down, serve next, cancel.
- 🔢 **Smart ordering** — the waiting line is always renumbered 1, 2, 3… ; served/cancelled tokens leave the line.
- 📊 **Analytics dashboard** — total queues, waiting tokens, served/cancelled today, average wait time, longest queue + 4 Recharts graphs.
- ✅ **Validation everywhere** — duplicate queue names, empty names, "can't move top up / last down", "can't serve empty queue", "can't cancel a served token".
- 🎨 **Modern UI** — responsive layout, sidebar + navbar, modals, confirmation dialogs, loading spinners, empty states, toast notifications, 404 page, and Framer Motion animations.

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router DOM, Axios, React Hot Toast, React Icons, Recharts, Framer Motion |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, dotenv, cors |
| **Architecture** | MVC (Models · Controllers · Routes · Middleware · Config · Utils) |

---

## 📁 Folder Structure

```
internshal project/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI (Sidebar, Navbar, Modal, StatCard, ...)
│   │   ├── pages/               # Login, Dashboard, Queues, QueueDetail, NotFound
│   │   ├── layouts/             # DashboardLayout (sidebar + navbar shell)
│   │   ├── hooks/               # useAuth
│   │   ├── services/            # Axios instance + API calls (uses VITE_API_URL)
│   │   ├── context/             # AuthContext
│   │   └── utils/               # date formatting
│   ├── .env.example
│   └── vercel.json              # SPA routing rewrite for Vercel
│
└── server/                     # Express backend (MVC)
    ├── config/                  # db.js (MongoDB connection)
    ├── models/                  # Manager, Queue, Token (Mongoose schemas)
    ├── controllers/             # auth, queue, token, dashboard logic
    ├── routes/                  # API route definitions
    ├── middleware/              # auth (JWT), centralized error handler
    ├── utils/                   # asyncHandler, ApiError, generateToken, seed
    ├── server.js                # entry point
    └── .env.example
```

---

## ⚙️ Installation Steps

**Prerequisites:** Node.js 18+ and a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd "internshal project"

# 2. Install backend
cd server
npm install

# 3. Install frontend
cd ../client
npm install
```

---

## 🔑 Environment Variables

Copy each `.env.example` to `.env` and fill in the values.

### Backend — `server/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Local server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/queue_management` |
| `JWT_SECRET` | Secret used to sign JWTs | a long random string |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |
| `NODE_ENV` | `development` or `production` | `production` (on Render) |
| `SEED_ADMIN_EMAIL` | Default manager email | `admin@gmail.com` |
| `SEED_ADMIN_PASSWORD` | Default manager password | `admin123` |
| `SEED_ADMIN_NAME` | Default manager name | `Queue Manager` |

### Frontend — `client/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000` |

> 🔒 No URLs or secrets are hardcoded anywhere. The backend reads `process.env.*`; the frontend reads `import.meta.env.VITE_API_URL`.

---

## 💻 Local Development

Open **two terminals**.

```bash
# Terminal 1 — backend
cd server
npm run seed     # one-time: creates the admin (admin@gmail.com / admin123)
npm run dev      # starts API on http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev      # starts UI on http://localhost:5173
```

Open **http://localhost:5173** and log in with **admin@gmail.com / admin123**.

---

## 🚀 Deployment Instructions

Deploy the **backend on Render** and the **frontend on Vercel**. Both read their config from environment variables — nothing is hardcoded.

### 1. Push to GitHub
```bash
cd "internshal project"
git init
git add .
git commit -m "QueueFlow: full-stack queue management system"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### 2. Backend → Render
1. New **Web Service** → connect your GitHub repo.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`   **Start Command:** `npm start`
4. Add **Environment Variables:** `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `NODE_ENV=production`, and `CLIENT_URL` (set after step 3).
5. Deploy → copy the backend URL, e.g. `https://queueflow-api.onrender.com`.

### 3. Frontend → Vercel
1. New **Project** → import the same repo.
2. **Root Directory:** `client` (Framework preset: **Vite**).
3. Add **Environment Variable:** `VITE_API_URL = https://queueflow-api.onrender.com` (your Render URL).
4. Deploy → copy the frontend URL, e.g. `https://queueflow.vercel.app`.

### 4. Connect them
Go back to **Render → Environment** and set `CLIENT_URL = https://queueflow.vercel.app`. Render redeploys automatically. Done ✅

> **Where do the links go?** Never in the code — always as environment variables:
> - Backend (Render) URL → paste into **Vercel** as `VITE_API_URL`.
> - Frontend (Vercel) URL → paste into **Render** as `CLIENT_URL`.

---

## 📡 API Documentation

Base URL: `VITE_API_URL` (e.g. `http://localhost:5000`). All routes except login require the auth cookie.

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | `{ email, password }` | Log in; sets httpOnly cookie |
| `GET` | `/api/auth/me` | — | Get the logged-in manager |
| `POST` | `/api/auth/logout` | — | Clear the cookie |

### Queues
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/queues` | — | List queues (+ waiting count) |
| `POST` | `/api/queues` | `{ name }` | Create a queue |
| `GET` | `/api/queues/:id` | — | Get one queue |
| `DELETE` | `/api/queues/:id` | — | Delete a queue and its tokens |

### Tokens
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tokens/:queueId` | — | Get waiting line + history |
| `POST` | `/api/tokens` | `{ queueId, personName }` | Add a person (auto token number) |
| `PUT` | `/api/tokens/:id/up` | — | Move a token up |
| `PUT` | `/api/tokens/:id/down` | — | Move a token down |
| `PUT` | `/api/tokens/serve/:queueId` | — | Serve the next token (front of line) |
| `PUT` | `/api/tokens/:id/cancel` | — | Cancel a token |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Live stats + 7-day trend series |

---

## 🖼️ Screenshots

> _Add screenshots here after running the app._

| Login | Dashboard |
|-------|-----------|
| _screenshot_ | _screenshot_ |

| Queues | Queue Detail (Token Board) |
|--------|----------------------------|
| _screenshot_ | _screenshot_ |

---

## 📝 License

MIT — free to use for learning and interviews.
