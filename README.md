# Jewellery E-Commerce SPA

This repository contains the source code for a full-stack Single Page Application (SPA) designed for a Jewellery E-Commerce platform. The application is built with an emphasis on responsive design, secure API architecture, and maintainable code.

## Tech Stack
* **Frontend:** Angular 21 (Standalone Components, Tailwind CSS, Reactive Forms, `ngx-toastr` for notifications, `lucide-angular` for icons)
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** In-Memory Database (as permitted by requirements)
* **Validation & Security:** `zod` for strict payload validation, JWT (JSON Web Tokens) for authentication, `helmet`, and `express-rate-limit`.

## Setup & Run Instructions

### Prerequisites
* Node.js (v18 or higher recommended)
* Angular CLI (`npm install -g @angular/cli`)

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend server will run securely on `http://localhost:3000`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
   *The application will automatically compile and be accessible at `http://localhost:4200`.*

### Default Admin Login
To test the application's authenticated capabilities (adding/editing/deleting products), log in using the seeded credentials:
- **Email:** `admin@test.com`
- **Password:** `123456`

## Core Features
- **Responsive Grid Layout:** The UI seamlessly adapts across mobile, tablet, and desktop screens using Tailwind CSS grid layouts.
- **Advanced Filtering & Sorting:** Users can filter inventory by metal type, category, and price range. Sorting allows users to uniquely order products by price, name, or chronological additions (`latest`).
- **CRUD Operations:** Complete capability to Create, Read, Update, and Delete jewellery items with persistent form states and `Toastr` validations.
- **Dynamic Price Calculation:** The backend strictly calculates the final price of an item using its weight, the real-time metal price, making charges, shipping charges, and exact tax slabs to prevent frontend tampering.

## Assumptions & Design Decisions
In developing this platform, the following design decisions and assumptions were made to prioritize User Experience (UX) and architectural stability:

1. **In-Memory Database for Portability:** To keep the assignment easily reproducible and portable without requiring reviewers to provision a local MySQL database, an in-memory `product.db.ts` file acts as the primary data store. The seed data resets seamlessly upon server restart.
2. **Simplified Tax Application:** The requirements mention "multiple taxes may apply." For a cleaner user interface and simpler UX, I assumed aggregated tax bracket strings (e.g., GST (5%), GST (12%)) rather than forcing the user to check multiple individual tax checkboxes per jewelry item. The final calculation computes exact percentages against the base price cleanly.
3. **Price Calculation Architecture:** The Base price is calculated strictly as `(Weight * Metal Price)`. Tax is calculated purely on this base price, and then flat making + shipping charges are appended to the total. This was assumed to be the optimal mathematical flow for jewelry rate calculation.
4. **Standalone Angular Architecture:** The frontend utilizes Angular's modern Standalone Components ecosystem (`app.routes.ts`) instead of legacy `NgModules`. This leads to much leaner files, explicit dependency imports, and easier maintainability.
5. **Robust ID Assignments:** While generating `UUIDs` for strict identity management and API security internally, the system simultaneously assigns an auto-incrementing integer sequence (`productId`) to items. This dual-ID approach guarantees chronologically sorted displays (`latest` default logic) process in a human-readable order when filters are cleared.

---
*Developed for the Technical Assignment - SPA.*