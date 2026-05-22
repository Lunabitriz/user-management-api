# User Management API

Complete user management system with JWT authentication, password recovery, and profile photo uploads.

## Features

- JWT authentication and authorization
- Password recovery via email with verification codes
- User CRUD operations with validations
- Profile photo upload (base64 storage)
- Modern responsive React SPA
- Email notifications with HTML templates

## Tech Stack

**Backend:** NestJS, Prisma, PostgreSQL/SQLite, JWT, bcrypt, Nodemailer  
**Frontend:** React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS

## Quick Start

```bash
# Install dependencies (root + backend + frontend)
npm install

# Setup environment (backend)
cp backend/.env.example backend/.env

# Setup database
cd backend
npx prisma generate
npx prisma migrate dev

# Run full stack from repository root
cd ..
npm run dev
```

- API: `http://localhost:3000`
- SPA: `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM_NAME="User Management System"
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

In development, Vite proxies `/auth` and `/user` to the API when using relative URLs with an empty `VITE_API_URL`.

## API Endpoints

### Authentication

```
POST   /auth/login              - Login (JWT)
POST   /user                    - Register user
```

### Users

```
GET    /user                    - List all users
GET    /user/:id                - Get user by id
PUT    /user                    - Update user
DELETE /user/:id                - Delete user
POST   /user/upload-foto        - Upload profile photo
```

### Password Recovery

```
POST   /user/forgot-password    - Request password reset
POST   /user/verify-send-code   - Validate reset code
PUT    /user/redefine-password  - Reset password
```

## Web Interface (SPA Routes)

| Route | Page |
|-------|------|
| `/` | Login and registration |
| `/forgot-password` | Password recovery flow |
| `/account` | User dashboard (protected) |

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

## Photo Upload Requirements

- **Formats:** JPG, JPEG, PNG
- **Max size:** 5MB
- **Storage:** Base64 in database

## Scripts

```bash
# Root monorepo
npm run dev              # Nest + Vite concurrently
npm run dev:backend
npm run dev:frontend

# Backend
npm run start:dev --prefix backend
npm run build --prefix backend

# Frontend
npm run dev --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
```

## Project Structure

```
user-management-api/
├── backend/
│   ├── src/auth/       # JWT authentication
│   ├── src/user/       # User management
│   ├── src/mailer/     # Email service
│   └── prisma/         # Database schema & migrations
└── frontend/
    └── src/
        ├── api/        # HTTP client & endpoints
        ├── components/ # UI components
        ├── context/    # Auth & notifications
        ├── hooks/      # Feature hooks
        ├── pages/      # Route pages
        └── routes/     # Protected routes
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Reset codes expire in 10 minutes
- Protected SPA routes with client-side guard
- Email validation before sending codes

## License

MIT
