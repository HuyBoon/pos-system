# ☕ NZT Coffee & Tea POS System

A professional, high-performance Point of Sale (POS) system designed for efficiency and modern aesthetics. Built with a robust **NestJS** backend and a sleek **React** frontend, it ensures a seamless experience for both baristas and store managers.

---

## ✨ Features

### 🚀 Sales & Ordering
- **Interactive POS Interface**: Modern, touch-ready grid for rapid product selection.
- **Smart Checkout**: Support for dine-in and take-away orders with dynamic table selection.
- **Order Tracking**: Real-time status updates from pending to completed or cancelled.
- **VND Formatting**: Integrated currency formatting for precise financial records.

### 🏛️ Management Dashboard (Admin Only)
- **Table Management**: Real-time visualization and management of store layout (Available, Occupied, Reserved).
- **Product Inventory**: Full CRUD operations for products with automated stock tracking.
- **Categorization**: Multi-category support with custom iconography.
- **Dashboard Overview**: Key metrics and quick access to management tools.

### 🔐 Security & Reliability
- **JWT Authentication**: Secure login with role-based access control (Admin vs. Staff).
- **Database Consistency**: Powered by Prisma ORM with relational integrity.
- **Concurrency Support**: Transactional stock management to prevent over-ordering.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: Vanilla CSS with a custom modern design system
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: [class-validator](https://github.com/typestack/class-validator)

---

## 📦 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env with your DATABASE_URL
npx prisma generate
npx prisma db push
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Default Credentials
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`

---

## 📈 Database Schema
The system uses a highly relational schema including:
- `User` (Role-based)
- `Category` & `Product`
- `Table` (Linked to orders)
- `Order` & `OrderItem` (Linked to products and staff)

---

## 🎨 Design Philosophy
The system follows a **Premium Modern** design language:
- **HSL-based colors**: Soft surfaces and high-contrast accents.
- **Micro-animations**: Smooth transitions and interaction feedback.
- **Glassmorphism**: Subtle overlays for a clean, layered feel.

---

*Made with ❤️ for NZT Project.*
