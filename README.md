# Inventory Management API

A RESTful API for managing product inventory with role-based access control. Built with Node.js, Express, TypeScript, and Prisma.

## Features

- User authentication with JWT (register, login, protected routes)
- Role-based access control (admin vs regular user)
- Product CRUD operations (create, read, update, delete)
- Pagination for product listing
- Password hashing with bcrypt
- PostgreSQL database via Prisma ORM

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT + bcrypt |

## Getting Started

### Prerequisites

- Node.js installed
- A Neon PostgreSQL database (free at https://neon.tech)

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/inventory-api.git
cd inventory-api