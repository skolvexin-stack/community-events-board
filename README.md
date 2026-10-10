# Community Events Board

A web app where an admin posts local events and visitors browse, filter, and personalise their feed.

Built with Next.js 16 (App Router), MongoDB, Mongoose, JWT auth, and Tailwind CSS.

---

## Setup (under 5 minutes)

### Prerequisites

- Node.js 20+
- MongoDB running locally (or a MongoDB Atlas connection string)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and update MONGODB_URI if needed
cp .env.example .env

# 3. Seed sample data (15 events)
npm run db:seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The default `MONGODB_URI` points to `mongodb://localhost:27017/community_events_board`. If you're using Atlas, replace it with your connection string.

---

## Admin login

| Field    | Value              |
| -------- | ------------------ |
| Email    | admin@fyerx.com    |
| Password | Admin@123          |
| URL      | /admin/login       |

These values come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---

## API Reference

All API routes return JSON. User routes expect `Authorization: Bearer <token>` in the request header. Admin routes expect a separate admin JWT.

| Method | Path                         | Auth  | Description                              |
| ------ | ---------------------------- | ----- | ---------------------------------------- |
| POST   | /api/auth/signup             | —     | Register a new user                      |
| POST   | /api/auth/login              | —     | Login; returns JWT                       |
| GET    | /api/events                  | —     | List active upcoming events (filters + pagination) |
| GET    | /api/events/:id              | —     | Single event detail                      |
| GET    | /api/feed                    | User  | Events matching user's preferred categories |
| GET    | /api/reminders               | User  | List event IDs the user has reminded     |
| POST   | /api/reminders               | User  | Toggle reminder for an event             |
| GET    | /api/preferences             | User  | Get user's favourite categories          |
| PUT    | /api/preferences             | User  | Update favourite categories              |
| GET    | /api/card-design/:eventId    | User  | Get saved card design for an event       |
| POST   | /api/card-design/:eventId    | User  | Save card design for an event            |
| POST   | /api/admin/auth/login        | —     | Admin login; returns admin JWT           |
| GET    | /api/admin/events            | Admin | List all events (incl. inactive)         |
| POST   | /api/admin/events            | Admin | Create a new event                       |
| PATCH  | /api/admin/events/:id        | Admin | Toggle isActive on an event              |

### Query params for `GET /api/events`

| Param      | Example     | Description                     |
| ---------- | ----------- | ------------------------------- |
| `category` | `Music`     | Filter by category              |
| `city`     | `Bengaluru` | Filter by city                  |
| `q`        | `night`     | Full-text search (title + desc) |
| `page`     | `2`         | Page number (default 1)         |

---

## Three short answers

### 1. Database structure — why designed this way?

The `Event` document is the core. `User` embeds three things directly: a `preferences` array of category strings, a `reminders` array of Event ObjectIds, and a `cardDesigns` array of subdocuments (`{ eventId, theme, stickers }`). This is idiomatic MongoDB — data that is always read and written together with the user lives inside the user document, avoiding extra round-trips. Each event has its own document with compound indexes on `(isActive, dateTime)`, `(category, isActive)`, and `(city, isActive)` to make the filter queries fast.

### 2. How the filter query works, and what index I'd add

The events listing query builds a Mongoose filter object:

```js
{
  isActive: true,
  dateTime: { $gt: new Date() },
  ...(category && { category }),
  ...(city && { city }),
  ...(q && { $or: [
    { title: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } }
  ]})
}
```

The `(isActive, dateTime)` compound index lets MongoDB skip past inactive and past events in one pass. For the text search, I would replace the regex with MongoDB's `$text` operator and a text index on `title` and `description`:

```js
EventSchema.index({ title: "text", description: "text" });
// query: { $text: { $search: q } }
```

Text indexes in MongoDB support stemming and stop-word filtering, and are significantly faster than `$regex` at scale.

### 3. Password storage and admin protection

Passwords are hashed with `bcryptjs` at a cost factor of 12 before being stored — bcrypt is deliberately slow to resist brute-force attacks.

**User routes** are protected by verifying a JWT (HS256, 7-day expiry) signed with `JWT_SECRET`. The token is checked in the `Authorization: Bearer` header for API routes.

**Admin pages** are protected at two layers:
1. `proxy.ts` (Next.js 16 edge middleware) reads the `admin_token` cookie and redirects to `/admin/login` if it's missing or invalid — this blocks page rendering before it even reaches the route handler.
2. Each admin API route (`/api/admin/*`) independently verifies the admin JWT from the `Authorization` header using a separate `ADMIN_JWT_SECRET`, so the API cannot be accessed even if someone bypasses the page redirect.

The two secrets (`JWT_SECRET` and `ADMIN_JWT_SECRET`) are independent, so a leaked user token cannot be used for admin access.

---

## What's left

All required features are implemented. If I had more time I would:
- Add rate limiting on the auth endpoints
- Paginate `/api/feed` and `/api/reminders`
- Add unit tests for the filter query and JWT helpers
