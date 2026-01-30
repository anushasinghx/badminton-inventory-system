# 🏸 InventoryPro – Badminton Inventory Management System
**By Anusha Singh**

InventoryPro is a full-stack inventory management system that helps merchants manage products, track stock levels, view inventory analytics, and export data.

---

## 🚀 Live Application

**Frontend (Dashboard UI)**  
https://badminton-inventory-system-fe.netlify.app

**Backend (API Health Check)**  
https://badminton-inventory-system-be-n9g1.onrender.com/api/health

> Note: The backend is an API-only service. The root URL (`/`) intentionally returns 404. All functionality is exposed under `/api/*`.

---

## 🧩 Core Features

### 📊 Dashboard
- Inventory overview with total products and total inventory value  
- Low stock and out-of-stock alerts  
- Product category distribution  
- Recent inventory activity log  
- Manual data refresh option  

### 📦 Products (CRUD)
- Add, update, and delete products  
- View products with stock status and inventory value  
- Search by product name or SKU  
- Filter and sort by stock, price, and last updated  

### 📜 Stock History
- Tracks all inventory movements  
- Displays stock increases and decreases with timestamps  

### 📤 Export
- Export inventory data in CSV format  
- Optional date range filtering  
- Include low-stock and out-of-stock products  

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- TypeScript
- Axios

**Backend**
- Node.js
- Express
- TypeScript
- In-memory data storage

**Deployment**
- Frontend: Netlify
- Backend: Render

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- npm
- Git

---

```bash
1️⃣ Clone the Repository
git clone https://github.com/anushasinghx/badminton-inventory-system.git
cd inventory-system

2️⃣ Backend Setup
cd server
npm install
npm run dev
Backend runs at:
http://localhost:5000/api/health

3️⃣ Frontend Setup
cd ../client
npm install
npm run dev
Frontend runs at:
http://localhost:5173
```

### Environment Variables (Production):
VITE_API_URL=https://badminton-inventory-system-be-n9g1.onrender.com
Backend (Render): NODE_ENV=production
                  CORS_ORIGIN=https://badminton-inventory-system-fe.netlify.app

### 👤Author
### Anusha Singh
