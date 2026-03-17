# BAZAGOD HMS — Hotel Management System

A full-stack, multi-tenant Hotel Management SaaS platform built with **Next.js 14**, **Laravel 12**, and **MySQL**. Designed as a production-grade system comparable to Cloudbeds, Opera PMS, and Hotelogix.

> Luxury hotel on the shores of Lake Tanganyika — Bujumbura, Burundi

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, TailwindCSS |
| **Backend** | Laravel 12 (REST API), PHP 8.2+ |
| **Database** | MySQL 8.0 (multi-tenant schema) |
| **Auth** | Laravel Sanctum (token-based) + Spatie Permission (RBAC) |
| **State** | Zustand (client), React Query (server state) |
| **UI** | Framer Motion, Lucide Icons, Recharts |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Frontend                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Public   │  │ Dashboard│  │ Feature Modules   │  │
│  │ Website  │  │ (HMS)    │  │ rooms/reservations│  │
│  └──────────┘  └──────────┘  │ staff/accounting  │  │
│                               └───────────────────┘  │
│  Zustand Store ←→ API Service Layer ←→ React Query   │
└────────────────────────┬────────────────────────────┘
                         │ REST API (JSON)
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Laravel Backend                    │
│  ┌────────────┐  ┌──────────┐  ┌────────────────┐   │
│  │ Controllers│→ │ Services │→ │ Repositories   │   │
│  │ (HTTP)     │  │ (Logic)  │  │ (Database)     │   │
│  └────────────┘  └──────────┘  └────────────────┘   │
│  Requests (Validation) │ Resources (Serialization)   │
│  Middleware: Auth, Tenant Isolation, CORS             │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              MySQL (Multi-Tenant Schema)             │
│  tenants → users → rooms → reservations → payments   │
│  Each table scoped by tenant_id                      │
└─────────────────────────────────────────────────────┘
```

---

## Features

### Hotel Management Dashboard
- **Dashboard** — occupancy rates, revenue, arrivals/departures, recent reservations
- **Room Management** — room types, individual rooms, status tracking, housekeeping
- **Reservations** — full lifecycle (create → confirm → check-in → check-out), search, filters
- **Staff Management** — departments, employee records, scheduling
- **Accounting** — invoices, payments, expenses tracking
- **Inventory** — stock management with transactions
- **Restaurant & POS** — menu management, order tracking
- **Conference** — meeting room bookings

### Public Website
- Luxury landing page with hero, room showcase, gallery, testimonials
- Room detail pages with booking forms
- Contact form, amenities section, interactive map
- Admin gallery management (image upload/delete)

### Platform Features
- **Multi-Tenancy** — full tenant isolation per hotel via `tenant_id` scoping
- **RBAC** — 4 roles (admin, manager, receptionist, staff) with 18 granular permissions
- **API Versioning** — all endpoints under `/api/v1/`
- **Sanctum Auth** — token-based with 7-day expiry, auto-refresh

---

## Project Structure

```
bazagod-hotel/
├── src/                          # Next.js Frontend
│   ├── app/
│   │   ├── (public)/             # Public website (landing, rooms)
│   │   ├── dashboard/            # HMS application
│   │   │   ├── rooms/
│   │   │   ├── reservations/
│   │   │   ├── staff/
│   │   │   └── settings/
│   │   └── api/                  # Legacy admin routes
│   ├── components/
│   │   ├── ui/                   # Reusable primitives (Button, Card, Input)
│   │   ├── dashboard/            # HMS components (Sidebar, DataTable, StatCard)
│   │   └── sections/             # Public site sections
│   ├── features/                 # Feature-based API services
│   │   ├── rooms/services/
│   │   ├── reservations/services/
│   │   └── staff/services/
│   ├── store/                    # Zustand stores
│   ├── services/                 # Shared API client (Axios)
│   └── types/                    # TypeScript interfaces
│
├── backend/                      # Laravel API
│   ├── app/
│   │   ├── Modules/              # Domain modules
│   │   │   ├── Auth/             # Authentication & dashboard
│   │   │   ├── Room/             # Controllers, Services, Repos, Models
│   │   │   ├── Reservation/      # Full booking lifecycle
│   │   │   ├── Staff/            # Employee management
│   │   │   └── Tenant/           # Multi-tenancy
│   │   ├── Enums/                # RoomStatus, ReservationStatus, PaymentStatus
│   │   ├── Traits/               # BelongsToTenant (auto-scoping)
│   │   └── Http/Middleware/      # EnsureTenantAccess, ForceJsonResponse
│   ├── database/
│   │   ├── migrations/           # 13 migration files, 20+ tables
│   │   └── seeders/              # Demo data with roles & permissions
│   └── routes/api.php            # 37 API endpoints
│
└── docker-compose.yml            # One-command setup
```

---

## Getting Started

### Option 1: Docker (Recommended)

```bash
docker compose up -d
```

This starts MySQL, the Laravel API, and the Next.js frontend. Access:
- **Frontend:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard
- **API:** http://localhost:8000/api/v1

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate

# Create MySQL database
mysql -u root -e "CREATE DATABASE bazagod_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Update .env with your MySQL credentials, then:
php artisan migrate --seed
php artisan serve
```

**Frontend:**
```bash
npm install
cp .env.example .env.local
npm run dev
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@bazagod.bi` | `password` |
| Manager | `manager@bazagod.bi` | `password` |

---

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate user |
| `GET` | `/auth/me` | Get current user profile |
| `POST` | `/auth/logout` | Revoke token |
| `GET` | `/dashboard` | Dashboard stats & recent activity |
| `GET` | `/rooms` | List rooms (paginated, filterable) |
| `POST` | `/rooms` | Create room |
| `GET` | `/rooms-availability` | Check availability for date range |
| `GET` | `/room-types` | List room types |
| `POST` | `/reservations` | Create reservation |
| `POST` | `/reservations/{id}/confirm` | Confirm reservation |
| `POST` | `/reservations/{id}/check-in` | Check in guest |
| `POST` | `/reservations/{id}/check-out` | Check out guest |
| `GET` | `/front-desk/arrivals` | Today's expected arrivals |
| `GET` | `/front-desk/departures` | Today's expected departures |
| `GET` | `/staff` | List staff (paginated, searchable) |
| `GET` | `/departments` | List departments |

See `backend/routes/api.php` for all 37 endpoints.

---

## Design Decisions

### Why Service-Repository Pattern?
Controllers stay thin (HTTP only). Services contain business logic (reservation workflows, pricing calculations). Repositories encapsulate queries. This makes each layer independently testable and replaceable.

### Why Tenant Scoping via Trait?
The `BelongsToTenant` trait adds a global scope to every query automatically. No manual `where('tenant_id', ...)` scattered across the codebase. One trait, zero data leakage.

### Why Zustand over Redux?
For this scale, Zustand provides the same capabilities with ~90% less boilerplate. No providers, no reducers, no action creators. Just a hook.

### Why Feature-Based Frontend Structure?
Each feature (rooms, reservations, staff) owns its API service, components, and hooks. Adding a new module means adding a new folder — no touching shared code.

---

## License

MIT
