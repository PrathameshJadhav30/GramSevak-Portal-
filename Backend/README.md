# Gram Panchayat Portal Backend

Production-ready backend built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Stack
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT auth + RBAC (admin, villager)
- Zod validation
- Multer file uploads
- Helmet, CORS, Morgan, rate limiting

## Setup
1. Install dependencies:
   npm install
2. Configure environment:
   copy `.env.example` to `.env` and update values.
3. Generate Prisma client:
   npm run prisma:generate
4. Run migrations:
   npm run prisma:migrate
5. Start server:
   npm run dev

## API Base URL
- http://localhost:5000/api/v1

## Health
- GET /health

## Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login

## Users
- GET /api/v1/users/me
- PUT /api/v1/users/me
- DELETE /api/v1/users/:id (admin)

## Services
- POST /api/v1/services (admin)
- GET /api/v1/services
- PUT /api/v1/services/:id (admin)
- DELETE /api/v1/services/:id (admin)

## Service Applications
- POST /api/v1/applications (villager)
- GET /api/v1/applications/me (villager)
- GET /api/v1/applications (admin)
- PATCH /api/v1/applications/:id/status (admin)
- DELETE /api/v1/applications/:id

## Notices
- POST /api/v1/notices (admin)
- GET /api/v1/notices (public, supports ?language=en|mr)
- PUT /api/v1/notices/:id (admin)
- DELETE /api/v1/notices/:id (admin)

## Committee Members
- POST /api/v1/committee-members (admin)
- GET /api/v1/committee-members
- PUT /api/v1/committee-members/:id (admin)
- DELETE /api/v1/committee-members/:id (admin)

## Complaints
- POST /api/v1/complaints (villager)
- GET /api/v1/complaints/me (villager)
- GET /api/v1/complaints (admin)
- PATCH /api/v1/complaints/:id/status (admin)
- DELETE /api/v1/complaints/:id

## Documents
- POST /api/v1/documents (multipart/form-data: file, type)
- GET /api/v1/documents/me
- GET /api/v1/documents (admin)
- DELETE /api/v1/documents/:id

## Notes
- All list endpoints support pagination using `page` and `limit`.
- Several list endpoints support filtering (`status`, `search`, `language`, etc.).
- Uploaded files are served from `/uploads`.
