# Inventory Management System – Implementation Summary

### Frontend (Next.js)
- Next.js
- React
- Axios
- Shadcn UI
- Radix UI
- Sonner (Toast notifications)
- Lucide React (Icons)
- clsx, tailwind-merge
- Tailwind CSS utilities

### Backend (Laravel)
- Laravel Framework
- Laravel Sanctum (Authentication)
- Laravel Tinker
- PHP 8.2

---

## API Configuration
- Base URL from `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_API_BASE`
- Default: `http://127.0.0.1:8000/api`
- All requests send `Accept: application/json`
- Bearer token used for authentication
- On `401` → user logged out and redirected to `/login`


## API Reference

| Method | Endpoint              | Auth     | Role          |
|--------|-----------------------|----------|---------------|
| POST   | /login                | —        | —             |
| POST   | /logout               | Token    | any           |
| GET    | /me                   | Token    | any           |
| GET    | /users                | Token    | admin         |
| POST   | /users                | Token    | admin         |
| PUT    | /users/{id}           | Token    | admin         |
| DELETE | /users/{id}           | Token    | admin         |
| GET    | /cupboards            | Token    | admin         |
| POST   | /cupboards            | Token    | admin         |
| PUT    | /cupboards/{id}       | Token    | admin         |
| DELETE | /cupboards/{id}       | Token    | admin         |
| GET    | /places               | Token    | admin         |
| POST   | /places               | Token    | admin         |
| PUT    | /places/{id}          | Token    | admin         |
| DELETE | /places/{id}          | Token    | admin         |
| GET    | /items                | Token    | admin, staff  |
| POST   | /items                | Token    | admin, staff  |
| PUT    | /items/{id}           | Token    | admin, staff  |
| DELETE | /items/{id}           | Token    | admin, staff  |
| GET    | /borrow-records       | Token    | admin, staff  |
| POST   | /borrow               | Token    | admin, staff  |
| POST   | /return/{borrow_id}   | Token    | admin, staff  |
| GET    | /activity-logs        | Token    | admin         |


## Database Schema

```
users           id, name, email, password, role
cupboards       id, name, location
places          id, name, cupboard_id → cupboards
items           id, name, code(unique), quantity, serial_number,
                description, image_path, place_id → places, status
borrows         id, item_id → items, borrower_name, borrower_contact,
                quantity, borrow_date, expected_return_date,
                returned_date, status, created_by → users
activity_logs   id, user_id → users, action, entity_type, entity_id,
                old_value (jsonb), new_value (jsonb)
```
