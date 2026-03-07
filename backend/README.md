# Menova Backend

FastAPI backend for Menova Restaurant SaaS platform.

## Features
- FastAPI with Pydantic for validation
- MongoDB with Motor (async)
- JWT Authentication
- QR Code Generation
- Category and Menu Item Management
- Order Processing

## Setup

### Prerequisites
- Python 3.10+
- MongoDB (running locally or a cloud instance)
- Poetry

### Installation
1. Install dependencies:
   ```bash
   poetry install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and update the values as needed.

3. Run the development server:
   ```bash
   poetry run uvicorn main:app --reload
   ```

## Project Structure
```
backend/
├── app/
│   ├── api/v1/ (auth.py, restaurant.py, menu.py, orders.py, public.py, qr_code.py)
│   ├── core/ (config.py, security.py, database.py)
│   ├── models/ (user.py, restaurant.py, category.py, menu_item.py, order.py)
│   ├── schemas/ (matching Pydantic schemas)
│   └── services/ (business logic)
├── pyproject.toml  # Poetry configuration
├── .env           # Environment configuration
└── main.py
```

## API Documentation
Once the server is running, you can access the interactive API docs:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
