# CRM Backend API

A NestJS-based REST API for Customer Relationship Management with JWT authentication and Prisma ORM.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Entities**: Users, Companies, Contacts, and Deals with proper relationships
- **API**: RESTful endpoints with pagination, sorting, and filtering
- **Validation**: Request validation using class-validator
- **CORS**: Configured for frontend integration

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Password Hashing**: bcrypt

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Environment Configuration

Copy the example environment file and configure your database:

\`\`\`bash
cp .env.example .env
\`\`\`

Update the `.env` file with your database credentials:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/crm_db"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
\`\`\`

### 3. Database Setup

First, create your PostgreSQL database, then run the initial schema creation:

\`\`\`bash
# Run the initial database schema (from the scripts folder)
psql -d crm_db -f ../scripts/01-create-database-schema.sql
psql -d crm_db -f ../scripts/02-seed-sample-data.sql
psql -d crm_db -f ../scripts/03-prisma-migration.sql
\`\`\`

### 4. Prisma Setup

Generate the Prisma client and sync with your database:

\`\`\`bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database (alternative to migrations)
npm run prisma:push

# Or run migrations (if you prefer migration-based workflow)
npm run prisma:migrate
\`\`\`

### 5. Start the Server

\`\`\`bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
\`\`\`

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (requires JWT)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Companies
- `GET /companies` - Get all companies (with pagination)
- `POST /companies` - Create new company
- `GET /companies/:id` - Get company by ID
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

### Contacts
- `GET /contacts` - Get all contacts (with pagination)
- `POST /contacts` - Create new contact
- `GET /contacts/:id` - Get contact by ID
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

### Deals
- `GET /deals` - Get all deals (with pagination)
- `POST /deals` - Create new deal
- `GET /deals/:id` - Get deal by ID
- `PUT /deals/:id` - Update deal
- `DELETE /deals/:id` - Delete deal

## Database Schema

The application uses the following main entities:

- **Users**: Authentication and user management
- **Companies**: Business entities
- **Contacts**: Individual contacts associated with companies
- **Deals**: Sales opportunities with company and contact associations
- **DealContacts**: Many-to-many relationship between deals and contacts

## Development

### Prisma Commands

\`\`\`bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
\`\`\`

### Testing

\`\`\`bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
\`\`\`

## Production Deployment

1. Set environment variables in your production environment
2. Run database migrations
3. Build the application: `npm run build`
4. Start the production server: `npm run start:prod`

## API Documentation

The API follows RESTful conventions with JSON request/response format. All protected endpoints require a valid JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
