# Menova — Modern Restaurant Digital Menu SaaS 🍽️

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-leaf.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)

**Menova** is a sophisticated full-stack SaaS platform designed for restaurants to create, manage, and share stunning digital menus. From real-time branding customization to interactive QR code ordering, Menova provides everything a modern dining establishment needs to go digital.

---

## ✨ Core Features

### 🎨 Advanced Brand Customization
*   **Dynamic Layouts**: Choose from four professional menu styles: *Classic*, *Grid*, *Minimal*, or *Premium*.
*   **Premium Typography**: Integrated with Google Fonts (Inter, Roboto, Outfit, Playfair Display, etc.) to match your restaurant's personality.
*   **Accent Theming**: Instantly update your menu's primary colors to align with your brand identity.
*   **Branding Assets**: Upload logos and set custom taglines that appear across all customer-facing touchpoints.

### 📱 Premium Menu Preview
*   **Live Preview**: Real-time visual feedback as you customize your menu.
*   **Device Simulation**: View your menu exactly how customers see it with interactive **Mobile**, **Tablet**, and **Desktop** frame toggles.
*   **Responsive Navigation**: Smooth, no-scrollbar category bar with smart arrow indicators for easy browsing.

### 🛠️ Menu & Operations Management
*   **Digital Menu Builder**: Organize dishes into categories with name, description, and availability toggles.
*   **Image Uploads**: Upload high-quality food photography directly to menu items.
*   **Universal Menu Flow**: Option to bypass table numbers for a general "online menu" experience, or enable table-based ordering.
*   **Order Management**: Real-time order placement and status tracking for kitchen operations.
*   **QR Generation**: One-click QR code generation for tables, marketing materials, or social media.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite (TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB with Motor (Async driver)
- **Auth**: JWT (JSON Web Tokens)
- **Validation**: Pydantic v2
- **File Handling**: Multipart uploads for branding and menu assets

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.x or higher
- **Python**: 3.10.x or higher
- **Poetry**: [Installation Guide](https://python-poetry.org/docs/#installation)
- **MongoDB**: Local instance or MongoDB Atlas URI

### 1. Setup Backend
```bash
cd backend
poetry install
cp .env.example .env  # Update your MONGODB_URL and SECRET_KEY
poetry run uvicorn main:app --reload
```
*API docs available at: `http://localhost:8000/docs`*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*App available at: `http://localhost:5173`*

---

## 📁 Repository Structure

```text
Menova-SaaS/
├── backend/            # FastAPI service (Auth, Menu, Orders, Uploads)
│   ├── app/api/v1/     # REST API Endpoints
│   ├── app/models/     # MongoDB Document Models
│   └── app/schemas/    # Pydantic Validation Schemas
├── frontend/           # React SPA (Admin & Public Faces)
│   ├── src/pages/      # Feature-rich views (Customization, Preview, CRUD)
│   ├── src/components/ # Shared UI & Layout components
│   └── src/store/      # Centralized Zustand state
└── docker-compose.yml  # Deployment configuration
```

---

## 📄 License

This project is intended for demonstration and internal use. All rights reserved.

---

<p align="center">
  Built with ❤️ by the Menova Team
</p>
