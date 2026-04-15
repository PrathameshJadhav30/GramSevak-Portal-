# Gram Panchayat Portal Frontend

Production-ready React frontend for Gram Panchayat Portal with role-based UI, responsive layout, and backend API integration.

## Stack
- React (JavaScript)
- Tailwind CSS
- Axios
- React Router
- react-i18next (English/Marathi)
- react-hot-toast

## Features
- JWT authentication (token in localStorage)
- Role-based UI for admin and villager
- Protected routes with role restrictions
- REST API service layer in `src/services/api.js`
- Global API error handling (401, 403, 500)
- Mobile-first responsive design
- Loading/skeleton states and graceful error handling
- Reusable components: Button, Input, Card, Modal, StatusBadge, Skeleton
- Debounced search support

## Setup
1. Install dependencies:
	npm install
2. Add environment variables:
	copy `.env.example` to `.env`
3. Start dev server:
	npm run dev
4. Build production bundle:
	npm run build

## Environment
`VITE_API_BASE_URL` example:
`http://localhost:5000/api/v1`

## Main Routes
- `/login`
- `/register`
- `/dashboard`
- `/profile`
- `/services`
- `/applications` (admin)
- `/my-applications` (villager)
- `/complaints`
- `/notices`
- `/committee`
