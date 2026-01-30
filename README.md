#InventoryPro - Badminton Inventory System
I

By Anusha Singh

InventoryPro is a simple, full-stack inventory management system that helps merchants manage products, track stock levels, view inventory analytics, and export data.

🚀 Live Application

Frontend (Dashboard UI)
https://badminton-inventory-system-fe.netlify.app

Backend (API Health Check)
https://badminton-inventory-system-be-n9g1.onrender.com/api/health

Note: The backend is an API-only service. The root URL (/) intentionally returns 404. All functionality is exposed under /api/*.

🧩 Core Features
📊 Dashboard – Inventory Overview

Provides a real-time overview of inventory performance, including:

Total Products & Total Inventory Value

Low Stock and Out of Stock items

Product category distribution

Stock alerts and recent activity log

Manual data refresh option

📦 Products – Product Management (CRUD)

Manage the complete product catalog:

Add products with name, SKU, category, price, stock, and minimum threshold

View products with stock status, inventory value, and last updated time

Search by product name or SKU

Filter by stock status and category

Sort by name, price, stock level, or last updated

Update product details and adjust stock levels

Delete products with confirmation

📜 Stock History

Track all inventory movements over time:

Product name

Change amount (+ / −)

Previous and current stock

Reason for change

Timestamp

📤 Export

Export inventory data for analysis or backup:

CSV export format

Optional date range filtering

Include low-stock and out-of-stock products

One-click file download

🛠 Tech Stack

Frontend

React (Vite)

TypeScript

Axios

Responsive CSS

Backend

Node.js

Express

TypeScript

In-memory data storage

Deployment

Frontend: Netlify

Backend: Render

⚙️ Setup Instructions
Prerequisites

Node.js v18+

npm

Git

1️⃣ Clone the repository
git clone https://github.com/anushasinghx/badminton-inventory-system.git
cd inventory-system

2️⃣ Backend setup
cd server
npm install


Create .env (optional for local development):

PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173


Run backend:

npm run dev


Backend runs at:

http://localhost:5000/api/health

3️⃣ Frontend setup
cd ../client
npm install


Create .env:

VITE_API_URL=http://localhost:5000
VITE_APP_NAME=InventoryPro


Run frontend:

npm run dev


Frontend runs at:

http://localhost:5173

🌐 Environment Variables (Production)

Frontend (Netlify)

VITE_API_URL=https://badminton-inventory-system-be-n9g1.onrender.com


Backend (Render)

NODE_ENV=production
CORS_ORIGIN=https://badminton-inventory-system-fe.netlify.app
