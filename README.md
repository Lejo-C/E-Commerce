# E-Commerce

🛒 MERN E‑Commerce Platform
A full‑stack E‑Commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js). This project demonstrates secure authentication, product management, cart flows, and order tracking, deployed seamlessly on Render (backend) and Netlify (frontend).

🚀 Features
User Authentication: Signup/Login with JWT‑based authentication and cookie handling.

Product Management: CRUD operations for products with merchant dashboard.

Cart & Orders: Add to cart, place orders, and track purchases.

Merchant Dashboard: Real‑time order visibility and product control.

Responsive UI: Built with React + modern CSS for mobile and desktop.

Secure Backend: Protected routes, environment variable management, and MongoDB Atlas integration.

Deployment: Backend hosted on Render, frontend deployed via Netlify.

🛠️ Tech Stack
Frontend: React (Vite), Axios, Context API

Backend: Node.js, Express.js

Database: MongoDB Atlas

Authentication: JWT, bcrypt

Middleware: CORS, cookie‑parser

Deployment: Render (backend), Netlify (frontend)

⚙️ Installation & Setup
1. Clone the repo

bash
git clone https://github.com/Repo_Url

cd ecommerce-mern

3. Backend setup

bash
cd backend

npm install

Create a .env file:

env

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

Run backend:

bash
npm run dev

3. Frontend setup

bash
cd frontend

npm install
Create a .env file:

env
VITE_API_URL=http://localhost:5000
Run frontend:

bash
npm run dev
🌐 Deployment
Backend: Hosted on Render → https://e-commerce-xxxx.onrender.com

Frontend: Hosted on Netlify → https://ecommerce.netlify.app

Make sure to set environment variables in Render/Netlify dashboards.

🔒 Environment Variables
Backend .env:

env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

Frontend .env:

env
VITE_API_URL=https://e-commerce-xxxx.onrender.com


📈 Future Improvements
Payment gateway integration (Stripe/PayPal)

Admin analytics dashboard

Product reviews & ratings

Email notifications
