# 🚀 Smart URL Shortener API

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-orange.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-purple.svg)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deployed on Render](https://img.shields.io/badge/Deployed-Render-blueviolet)](https://render.com/)

A lightweight and modular URL Shortener API built with Express.js, TypeScript, and Prisma ORM.
Includes short link creation, redirects, and simple analytics with click tracking and expiry support.

## 🚀 Live Demo
Check out the deployed version: [https://smart-url-shortener-api.onrender.com](https://smart-url-shortener-api.onrender.com)

## 🧩 Features

* ✨ Shorten long URLs using unique short codes (NanoID)
* 🔗 Redirect to original URLs instantly
* 📊 Track access count and last access time
* ⏰ Optional expiry for short links
* ⚙️ Modular architecture (Controllers → Services → Routes)
* 🧱 Centralized validation and error handling (Zod + custom UrlError)
* 📦 Prisma ORM with migrations

## 🧱 Tech Stack

| Category     | Technologies                          |
|--------------|---------------------------------------|
| **Runtime**  | Node.js v18+                          |
| **Framework**| Express.js v5                         |
| **Language** | TypeScript                            |
| **ORM**      | Prisma                                |
| **Database** | PostgreSQL                            |
| **Validation**| Zod                                  |
| **Utilities**| NanoID, Dotenv                        |

## 🗂️ Folder Structure

```
smart_url_shortener_api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/        # Route logic (shorten, redirect, stats)
│   ├── middleware/         # Validation & error handling
│   ├── routes/             # v1 and index routes
│   ├── services/           # DB queries via Prisma
│   ├── utils/              # Prisma client, UrlError, helpers
│   └── index.ts            # App entry point
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/urlshortener"
PORT=3000
BASE_URL="http://localhost:3000"
NODE_ENV="development"
NANO_LEN = NanoID length, e.g., 7
BASE_URL = Base URL for shortened links, e.g., http://myshortener.com
```

## 🚦 API Endpoints

### 1️⃣ Create Short URL
**POST** `/api/v1/shorten`

**Request Body**
```json
{
  "url": "https://example.com",
  "expiresAt": "2025-12-01T00:00:00Z"
}
```

**Response (201)**
```json
{
  "success": true,
  "shortUrl": "http://localhost:3000/AbC123",
  "expiresAt": "2025-12-01T00:00:00.000Z"
}
```

**Error (400)**
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Invalid URL format",
  "error_name": "UrlError",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

### 2️⃣ Redirect to Original URL
**GET** `/:shortCode`

Example: `GET /AbC123`

**Response:**
`→ 302 Redirects to https://example.com`

**Error (410 – expired)**
```json
{
  "success": false,
  "statusCode": 410,
  "error": "Link expired",
  "error_name": "UrlError"
}
```

### 3️⃣ Get URL Stats
**GET** `/api/v1/stats/:shortCode`

**Response (200)**
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

### 4️⃣ Get All URLs
**GET** `/api/v1/all`

**Response**
```json
{
  "success": true,
  "data": {
    "urls": [
      { "originalUrl": "https://openai.com", "shortCode": "XyZ987" },
      { "originalUrl": "https://github.com", "shortCode": "AbC123" }
    ]
  }
}
```

### 5️⃣ Get Top Visited URLs
**GET** `/api/v1/top`

**Response**
```json
{
  "success": true,
  "data": {
    "topUrls": [
      { "shortCode": "AbC123", "accessCount": 48 },
      { "shortCode": "XyZ987", "accessCount": 33 }
    ]
  }
}
```

## ⚠️ Global Error Format
Every error in the app follows a consistent shape:

```json
{
  "success": false,
  "statusCode": 404,
  "error": "Not found",
  "error_name": "UrlError",
  "timestamp": "2025-11-11T12:30:00.000Z"
}
```

## 🧠 Run Locally

```bash
# 1️⃣ Install dependencies
npm install

# 2️⃣ Setup Prisma and DB
npx prisma migrate dev --name init

# 3️⃣ Start development server
npm run dev
```

## 📦 Build & Run

```bash
# Build
npm run build

# Start (production)
npm start
```

## 🧩 Example cURL Usage

```bash
curl -X POST http://localhost:3000/api/v1/shorten \
 -H "Content-Type: application/json" \
 -d '{"url": "https://openai.com"}'
```

**Response**
```json
{
  "success": true,
  "shortUrl": "http://localhost:3000/a1bC9d"
}
```

## 🧱 Project Highlights

* Modular, versioned architecture (routes/v1)
* Clean controller–service–middleware separation
* Centralized error handling (UrlError)
* Consistent API responses across success and errors
* Prisma-powered database layer with @unique shortCode indexing
* Expandable structure (ready for caching, auth, or analytics table)


## 🧑‍💻 Author
**Kaushik**
Backend Developer • Node.js & TypeScript Enthusiast
[GitHub](https://github.com/dvlprkaushik) <!-- Replace with your actual GitHub link -->

---
