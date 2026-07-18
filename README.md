# Ahmed Fares English Academy

Premium English learning platform for Egyptian Thanaweya Amma students.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL (Sequelize ORM) |
| Auth | JWT (access + refresh tokens) |
| i18n | Arabic / English bilingual |

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+

### Local Development

```bash
# 1. Install dependencies
npm run install:all

# 2. Set up environment
cp .env.example server/.env
# Edit server/.env with your database credentials

# 3. Run migrations & seed
npm run db:setup

# 4. Build client
npm run build

# 5. Start server
npm run start
```

The app will be available at `http://localhost:3000`.

### Development (with hot reload)

```bash
npm run dev
```

This runs both server (port 3000) and client (port 5173) simultaneously.

## Project Structure

```
ahmed-fares-academy/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Theme)
│   │   ├── i18n/          # Internationalization (EN/AR)
│   │   ├── pages/         # Page components
│   │   │   ├── public/    # Public pages (Home, Courses, Blog)
│   │   │   ├── auth/      # Login, Register
│   │   │   ├── student/   # Student dashboard
│   │   │   └── admin/     # Admin panel
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript interfaces
│   │   └── test/          # Test setup
│   └── dist/              # Production build
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database, env, swagger
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── models/        # Sequelize models (18 models)
│   │   ├── routes/        # API routes
│   │   ├── seeders/       # Database seeders
│   │   └── utils/         # Helpers (JWT, upload, etc.)
│   ├── migrations/        # Database migrations
│   ├── tests/             # Server tests (Jest)
│   └── uploads/           # User uploads
└── package.json           # Root scripts
```

## Deployment on Hostinger

### 1. Upload Project
Upload the entire project folder via SSH or File Manager.

### 2. Install Dependencies
```bash
cd ahmed-fares-academy
npm run install:all
```

### 3. Configure Environment
```bash
cp .env.example server/.env
nano server/.env
```

Set these values:
```
NODE_ENV=production
PORT=3000
DB_HOST=your-hostinger-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_ACCESS_SECRET=your-random-secret-min-32-chars
JWT_REFRESH_SECRET=your-random-secret-min-32-chars
```

### 4. Run Migrations & Seed
```bash
npm run db:setup
```

### 5. Build Client
```bash
npm run build
```

### 6. Build Server
```bash
npm run build:server
```

### 7. Start Production Server
```bash
NODE_ENV=production node server/dist/server.js
```

Or use PM2:
```bash
pm2 start server/dist/server.js --name "academy" --env NODE_ENV=production
```

### 8. Verify
- Visit `https://yourdomain.com`
- API docs: `https://yourdomain.com/api-docs`
- Health check: `https://yourdomain.com/api/health`

## Default Admin Account

- **Email:** admin@ahmedfares.com
- **Password:** Admin@123456

> Change this password after first login.

## Database Reset

```bash
npm run db:reset
```

This drops all tables, re-runs migrations, and seeds default data.

## Testing

```bash
# Client tests (26 tests)
npm run test:client

# Server tests (requires DB)
npm run test:server
```

## API Endpoints

### Public
- `GET /api/health` — Health check
- `GET /api/courses` — List published courses
- `GET /api/courses/:slug` — Course detail
- `GET /api/blog` — List blog posts
- `GET /api/public/announcements` — Active announcements

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user

### Student
- `POST /api/enrollments` — Enroll in course
- `GET /api/enrollments` — My enrollments
- `POST /api/progress/lessons/:id/complete` — Mark lesson complete
- `GET /api/exams/:id` — Get exam
- `POST /api/exams/:id/start` — Start exam attempt
- `PUT /api/exams/attempts/:id/submit` — Submit exam
- `POST /api/payments` — Submit payment proof
- `GET /api/payments/my` — My payments
- `POST /api/bookings` — Book session
- `GET /api/bookings/my` — My bookings
- `GET /api/certificates` — My certificates
- `GET /api/notifications` — My notifications

### Admin
- `GET /api/admin/dashboard` — Stats
- `GET /api/admin/users` — Users list
- `POST /api/admin/courses` — Create course
- `POST /api/admin/exams` — Create exam
- `PUT /api/admin/payments/:id/review` — Approve/reject payment
- `POST /api/admin/notifications` — Send notifications
- `GET /api/admin/announcements` — Manage announcements

Full API docs at `/api-docs`.

## Features

### Public Website
- Home page with hero, features, testimonials, CTA
- Course listing and detail pages
- Blog with post detail
- About and Contact pages
- Bilingual Arabic/English with RTL support

### Student Dashboard
- My Courses with progress tracking
- Payment submission (Vodafone Cash / InstaPay)
- Session bookings
- Certificate viewer (printable)
- Notification center
- Profile and password management

### Admin Panel
- Dashboard with stats
- User management
- Course/Chapter/Lesson CRUD
- Exam and question management
- Payment review with proof viewer
- Booking management
- Blog post management
- Notification sending
- Announcement management
- Site settings

### Performance
- Lazy-loaded pages (React.lazy + Suspense)
- Skeleton loading states
- Error boundary for graceful error handling
- Dark mode support

### Quality
- 26 client tests (Vitest + React Testing Library)
- Server test suite (Jest + Supertest)
- TypeScript strict mode
- ESLint + Prettier ready
