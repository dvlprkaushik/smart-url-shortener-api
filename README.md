# Smart URL Shortener API

I built this as a quick, no-frills URL shortener to handle the basics: turning long links into short ones, quick redirects, basic click tracking, and optional expiration dates. It's all in Node.js with Express, TypeScript for safety, and Prisma for the database side. Keeps things modular with separate controllers, services, and routes, plus some validation and error catching to make it reliable.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![NanoID](https://img.shields.io/badge/NanoID-green?style=for-the-badge&logo=npm&logoColor=white)

## Project Structure

```
src/
├── controllers/      # Route handlers for shorten, redirect, stats
├── middleware/       # Validation and error middleware
├── routes/           # API routes under v1
├── services/         # Core logic and Prisma queries
├── utils/            # Helpers like Prisma client and UrlError
└── index.ts          # Server startup

prisma/
├── schema.prisma     # Single Url model
└── migrations/       # DB changes

.env
package.json
tsconfig.json
README.md
```

## Database Overview

Just one Prisma model: **Url** – holds the original link, short code, click count, creation/last access times, and expiry if set.

Check the full schema in `/prisma/schema.prisma`.

## Try Now - Live Deployment

Hit it up live here: [Visit](https://smart-url-shortener-api.onrender.com)

### Health Check
[Visit](https://smart-url-shortener-api.onrender.com/) `GET /`

Quick server status ping.

**Live Example**: `curl https://smart-url-shortener-api.onrender.com/`

**Response**:
```json
{"status":"OK","message":"Server is running 🚀"}
```

### Info
[Visit](https://smart-url-shortener-api.onrender.com/info) `GET /info`

Package details straight from the source.

**Live Example**: `curl https://smart-url-shortener-api.onrender.com/info`

**Response**:
```json
{
  "name": "smart_url_shortener_api",
  "version": "1.0.0",
  "description": "A lightweight and modular URL shortener API built with Express, TypeScript, and Prisma. Includes short link creation, redirects, and simple analytics with click tracking and expiry support.",
  "author": "kaushik",
  "repository": "https://github.com/dvlprkaushik/smart-url-shortener-api.git",
  "license": "ISC"
}
```

## Shorten Routes

- **Create Short URL**: `POST /api/v1/shorten`
  Takes a URL and optional expiry, spits out a short code.
  *Body*: `{"url": "https://example.com", "expiresAt": "2025-12-01T00:00:00Z"}`
  *Example*: `curl -X POST http://localhost:3000/api/v1/shorten -H "Content-Type: application/json" -d '{"url":"https://example.com","expiresAt":"2025-12-01T00:00:00Z"}'`
  *Response* (201):
  ```json
  {
    "success": true,
    "shortUrl": "http://localhost:3000/AbC123",
    "expiresAt": "2025-12-01T00:00:00.000Z"
  }
  ```

## Redirect Routes

- **Redirect to Original**: `GET /:shortCode`
  Follows the short link to the real one, bumps the click count.
  *Example*: `curl -L http://localhost:3000/AbC123`
  *Success*: 302 to `https://example.com`
  *Error* (410 - Expired):
  ```json
  {
    "success": false,
    "statusCode": 410,
    "error": "Link expired",
    "error_name": "UrlError",
    "timestamp": "2025-11-11T12:00:00.000Z"
  }
  ```

## Stats Routes

- **URL Stats**: `GET /api/v1/stats/:shortCode`
  Pulls click count, timestamps, and expiry for a short code.
  *Example*: `curl http://localhost:3000/api/v1/stats/AbC123`
  *Response* (200):
  ```json
  {
    "success": true,
    "data": {
      "stats": {
        "originalUrl": "https://example.com",
        "shortCode": "AbC123",
        "accessCount": 48,
        "createdAt": "2025-11-10T09:12:00.000Z",
        "lastAccess": "2025-11-11T15:32:00.000Z",
        "expiresAt": "2025-12-01T00:00:00.000Z"
      }
    }
  }
  ```

- **All URLs**: `GET /api/v1/all`
  Lists every short link created.
  *Example*: `curl http://localhost:3000/api/v1/all`
  *Response* (200):
  ```json
  {
    "success": true,
    "data": {
      "urls": [
        {
          "originalUrl": "https://openai.com",
          "shortCode": "XyZ987"
        },
        {
          "originalUrl": "https://github.com",
          "shortCode": "AbC123"
        }
      ]
    }
  }
  ```

- **Top Visited**: `GET /api/v1/top`
  Shows the most-clicked shorts, sorted by hits.
  *Example*: `curl http://localhost:3000/api/v1/top`
  *Response* (200):
  ```json
  {
    "success": true,
    "data": {
      "topUrls": [
        {
          "shortCode": "AbC123",
          "accessCount": 48
        },
        {
          "shortCode": "XyZ987",
          "accessCount": 33
        }
      ]
    }
  }
  ```

## Response Format

**Success**:
```json
{
  "success": true,
  "data": {},
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Error**:
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Invalid URL format",
  "error_name": "UrlError",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

Catches UrlError, bad inputs, and 404s the same way.

**404 Not Found**:
```json
{
  "success": false,
  "statusCode": 404,
  "error": "Not found",
  "error_name": "UrlError",
  "timestamp": "2025-11-11T12:30:00.000Z"
}
```

## Environment Variables

```
DATABASE_URL=
PORT=
BASE_URL=
NODE_ENV=
NANO_LEN=
```

## Installation & Setup

1. Clone it down:
   ```bash
   git clone https://github.com/dvlprkaushik/smart-url-shortener-api
   cd smart-url-shortener-api
   npm install
   ```

2. Set up the DB:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

3. Drop your `.env` vars in.

4. Run dev mode:
   ```bash
   npm run dev
   ```

5. For prod:
   ```bash
   npm run build
   npm start
   ```

## Deployment

### PostgreSQL (Neon)
Free tier works fine—grab a connection string for `DATABASE_URL`.

### Backend (Render/Railway)
- Build: `npm install && npm run build`
- Start: `npm start`
- Plug in your env vars on the dashboard.

## Architecture Highlights

- API under `/api/v1` so it's easy to version later.
- Controllers call services for the heavy lifting, routes tie it together.
- UrlError handles all the oops moments consistently.
- Zod keeps inputs sane.
- Prisma with indexes on short codes for speed.
- NanoID for those clean, short codes without collisions.
- Tracks clicks and times out of the box.

## Technical Decisions

Went with NanoID because it's shorter and friendlier than full UUIDs. Unique indexes on codes mean lookups fly. Expiry's optional so links can stick around or vanish as needed. Middleware catches validation early, and TypeScript keeps the whole thing from falling apart.

## Author

**Kaushik**
Backend dev into Node.js, TypeScript, and clean APIs.
