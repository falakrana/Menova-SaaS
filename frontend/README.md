# Menova — Restaurant Digital Menu Platform

<p align="center">
  <strong>Create stunning digital menus. Generate QR codes. Enable table ordering.</strong><br/>
  A full-featured restaurant SaaS built for the modern dining experience.
</p>

---

## 📋 Project Description

**Menova** is a restaurant digital menu management platform that allows restaurant owners to:
- Build and manage their digital menu online
- Generate a unique QR code customers can scan at the table
- Customize branding (colors, fonts, logo)
- Let customers browse the menu from their phone — no app download required

This repository includes a FastAPI backend. The frontend talks to the backend via the API client in `src/lib/api.ts`.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🍽️ Digital Menu Builder | Create categories, add items with name, description, price, and availability |
| 📱 QR Code Generator | Auto-generate a scannable QR code linking to your public menu |
| 🎨 Brand Customization | Choose theme colors, font styles, and restaurant name |
| 📊 Dashboard Analytics | View menu views, QR scans, menu items, and popular items |
| 🔒 Auth Flow | Login and Register pages with validation |
| 📁 Settings | Update restaurant name, email, phone, and location |
| 📱 Mobile-First | Fully responsive — optimized for phone, tablet, and desktop |
| 🌗 Dark Mode | CSS custom-property-based theming with dark mode styles pre-configured |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Routing | [React Router v6](https://reactrouter.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| Animations | [Framer Motion](https://www.framer-motion.com/) |
| QR Code | [qrcode.react](https://github.com/zpao/qrcode.react) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| Build Tool | [Vite 5](https://vitejs.dev/) with SWC compiler plugin |

---

## 📦 Installation

**Prerequisites:** Node.js ≥ 18 and npm ≥ 9

```bash
# 1. Clone the repository
git clone https://github.com/urvashivankar/Menova-Saas.git
cd Menova-Saas/frontend

# 2. Install dependencies
npm install
```

---

## 🚀 How to Run

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. (Run this inside the `frontend` folder).

### Production Build
```bash
npm run build
npm run preview   # Preview the built output locally
```

### Run Tests
```bash
npm run test          # Run all tests once
npm run test:watch    # Watch mode
```

### Lint
```bash
npm run lint
```

---

## 📁 Folder Structure

```
menu-magic-main/
├── public/                   # Static assets served as-is
│   ├── placeholder.svg       # Fallback image placeholder
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx   # Sidebar + header shell for all dashboard pages
│   │   └── ui/                       # shadcn/ui component library (Radix-based)
│   ├── hooks/
│   │   └── use-toast.ts              # Toast notification hook
│   ├── lib/
│   │   ├── api.ts                    # API stub — ready for backend integration
│   │   └── utils.ts                  # Tailwind `cn()` merge utility
│   ├── pages/
│   │   ├── Landing.tsx               # Public marketing/landing page
│   │   ├── Login.tsx                 # Login form
│   │   ├── Register.tsx              # Registration form
│   │   ├── Dashboard.tsx             # Dashboard home with stats widgets
│   │   ├── Categories.tsx            # Manage menu categories (CRUD)
│   │   ├── MenuItemsPage.tsx         # Manage menu items (CRUD, search, filter)
│   │   ├── QRCodePage.tsx            # QR code viewer, download, print
│   │   ├── MenuPreview.tsx           # Dashboard-side preview of public menu
│   │   ├── MenuCustomization.tsx     # Live brand customization with preview
│   │   ├── OrdersPage.tsx            # Incoming orders with status updates
│   │   ├── SettingsPage.tsx          # Restaurant profile settings
│   │   ├── PublicMenu.tsx            # Customer-facing menu (scan → browse → order)
│   │   ├── CartPage.tsx              # Customer cart + place order
│   │   └── NotFound.tsx              # 404 fallback page
│   ├── store/
│   │   └── useStore.ts               # Zustand global state store
│   ├── test/
│   │   ├── setup.ts                  # Vitest + Testing Library setup
│   │   └── example.test.ts           # Example placeholder test
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Root router and provider setup
│   ├── main.tsx                      # App entry point
│   ├── index.css                     # Tailwind CSS + design tokens + animations
│   └── vite-env.d.ts                 # Vite environment type declarations
├── index.html                        # HTML entry point
├── package.json
├── tailwind.config.ts                # Tailwind theme configuration
├── tsconfig.json                     # TypeScript project references
├── vite.config.ts                    # Vite + React SWC plugin config
└── vitest.config.ts                  # Vitest test runner config
```

---

## 🗺️ User Flows

### Restaurant Owner
1. Visit `/` → Marketing landing page
2. `/register` → Create account (mock)
3. `/dashboard` → Overview of stats
4. `/dashboard/categories` → Manage menu categories
5. `/dashboard/items` → Add/edit/delete menu items
6. `/dashboard/qr-code` → Download and print QR code
7. `/dashboard/customization` → Live preview of brand theme

### Customer (via QR scan)
1. Scan QR → opens `/menu/:id`
2. Enter table number → view full menu
3. Browse by category, add items to cart
4. Navigate to `/cart` → review cart

---

## 🔮 Future Improvements

- **Multi-location support** — Allow one account to manage multiple restaurant branches
- **Analytics dashboard** — Integrate real data from an analytics backend (charts via Recharts are already wired)
- **Progressive Web App (PWA)** — Add service worker for offline support
- **Payment integration** — Integrate Razorpay or Stripe for online pre-payment at ordering
- **Dark mode toggle** — Surface the pre-configured `.dark` class via a UI toggle

---

## 📄 License

This project is intended as a demonstration application. All rights reserved.
