# Luxe Jewels - Administration System

A professional, high-performance administration portal for luxury jewellery e-commerce. Built with a Service-Oriented Architecture (SOA) using **Angular 17+**, **Node.js**, **Express**, and **PostgreSQL**.

## Core Features & Architecture

### 1. Robust Data Management (Prisma + PostgreSQL)
The system uses **Prisma ORM** for type-safe database access and automated migrations. 
- **Soft Delete**: Products are never permanently deleted from the database. A safety flag (`isDeleted`) ensures data integrity while keeping the UI clean.
- **Price Snapshots**: To protect historical order data, every product stores a snapshot of the metal price at the time of its last update.

### 2. Advanced Pricing & Tax Engine
A dynamic calculation engine handles the complex math of jewellery pricing:
- **Formula**: `Total = ((Weight * MetalPrice) + MakingCharges) * (1 + Tax%) + Shipping`
- **Live Breakdown**: The product management interface provides a real-time price breakdown (Metal Value, Making, Tax, Total) as you type.
- **Auto-Sync**: Metal rates (Gold, Silver, Platinum) are globally managed in Settings and automatically pull through to all product forms.

### 3. Integrated Media Handling (Cloudinary)
- High-resolution product images are managed via **Cloudinary**.
- Multiple images per product with a built-in carousel viewer.
- Automatic cleanup of deleted images from cloud storage.

### 4. Enterprise-Grade Security & Monitoring
- **JWT Authentication**: Secure, stateless session management with 1-hour rolling tokens.
- **Request Logging**: Integrated `Morgan` middleware for real-time API monitoring.
- **Persistent Error Logs**: All server-side anomalies are caught and saved to `backend/logs/error.log` with full stack traces.

---

## Setup & Installation

### 1. Backend Configuration
Create a `backend/.env` file:
```env
PORT=3000
DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"
JWT_SECRET="your_secure_secret_key"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

### 2. Database Initialization
From the `/backend` directory:
1. `npx prisma migrate dev` (Build tables)
2. `npx ts-node src/db/seed.ts` (Seed default admin and metal rates)

### 3. Running the App
- **Backend**: `npm run dev`
- **Frontend**: `npm run start` (Access at `http://localhost:4200`)

### Default Admin Credentials
- **Email**: `admin@test.com`
- **Password**: `123456`