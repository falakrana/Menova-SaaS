# Menova Digital Menu SaaS

Menova is a full-stack SaaS platform for restaurants to manage digital QR-based menus, branding, and table ordering.

This repository contains both the customer- and admin-facing frontend and a FastAPI-based backend.

## Project Overview

- **`/frontend`** – React 18 + Vite + TypeScript single-page app for restaurant owners and customers. Includes admin dashboard, digital menu, QR flow, and table ordering. See the frontend-specific documentation in `frontend/README.md`.
- **`/backend`** – FastAPI service that provides authentication, restaurant, menu, order, and QR code APIs backed by MongoDB. See the backend-specific documentation in `backend/README.md`.

## Architecture

- **Frontend**
  - React 18, TypeScript, Vite 5
  - Tailwind CSS, shadcn/ui, Framer Motion
  - Zustand for state management
  - React Router for routing
  - Vitest and Testing Library for tests

- **Backend**
  - FastAPI with Pydantic models
  - MongoDB with Motor (async driver)
  - JWT-based authentication
  - Modular API design under `app/api/v1`

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (or another Node.js package manager)
- Python 3.10 or higher
- [Poetry](https://python-poetry.org/)
- MongoDB (local instance or managed service)

### 1. Clone the repository

```bash
git clone https://github.com/urvashivankar/Menova-Saas.git
cd Menova-Saas
```

### 2. Run the backend

From the project root:

```bash
cd backend
poetry install
cp .env.example .env   # Configure database URL, JWT settings, etc.
poetry run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 3. Run the frontend

In a separate terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will be available at `http://localhost:5173`.

If you connect the frontend to the backend, ensure the API base URL in the frontend configuration matches your backend URL.

## Repository Structure

```text
Menova-Saas/
├── backend/     FastAPI backend (MongoDB, JWT auth, REST API)
├── frontend/    React + Vite frontend for admin dashboard and public menu
├── .gitignore   Git exclusion rules
└── README.md    Full-stack project overview (this file)
```
