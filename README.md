# 🎨 ArtisanKala

ArtisanKala is a full-stack web application built to showcase and manage handmade artisan products. It allows users to perform complete CRUD (Create, Read, Update, Delete) operations on products through a REST API connected to a PostgreSQL database.

---

## 🚀 Tech Stack

### Frontend
- Next.js
- React
- CSS

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL (Supabase)

### ORM
- Prisma

---

# 📂 Project Structure

```
artisankala/
│
├── app/                 # Next.js frontend
├── components/          # React components
├── public/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── prismaClient.js
│   ├── routes/
│   │   └── products.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

# 🗄️ Database

This project uses **PostgreSQL** hosted on **Supabase** with **Prisma ORM**.

### Why PostgreSQL?

- Reliable relational database
- Supports structured data
- Works seamlessly with Prisma
- Easy cloud hosting using Supabase

---

# 🗃️ Database Schema

Insert your schema diagram here.

Example:

```
Product
-------------------------
id          Int
name        String
description String
price       Float
image       String
category    String
createdAt   DateTime
```

After creating your diagram, replace this section with:

```md
![Schema Diagram](W5_SchemaDiagram_YourInternID.png)
```

---

# ⚙️ Setup

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Frontend

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:3000
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
DATABASE_URL="your_database_url"

DIRECT_URL="your_direct_database_url"
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migration

```bash
npx prisma migrate dev
```

---

## Start Backend

```bash
node server.js
```

Backend runs on

```
http://localhost:5000
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| GET | /api/products/search/:name | Search products |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

---

# 📷 CRUD Operations

The application supports:

- ✅ Create Product
- ✅ Read Products
- ✅ Update Product
- ✅ Delete Product

---

# 👩‍💻 Author

**Bhawna Bisht**

BCA (AI & DS)

Graphic Era University