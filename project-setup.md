# Dashboard Application Project Guide

## Overview

This project is a modern full-stack web application featuring a React frontend with Express backend. It implements an analytics dashboard with user authentication, data visualization, and transaction tracking. The application uses a PostgreSQL database with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: shadcn/ui component library (based on Radix UI primitives)
- **Styling**: Tailwind CSS for styling
- **State Management**: React Query for data fetching and state
- **Routing**: Wouter for lightweight client-side routing
- **Animation**: Framer Motion for UI animations

### Backend
- **Framework**: Express.js (Node.js)
- **API**: RESTful API endpoints
- **Authentication**: Custom authentication system (login/logout endpoints)

### Data Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured but not fully implemented yet)
- **Schema**: User, Transaction, and Stats tables defined

## Key Components

### Frontend Components
1. **Pages**:
   - Login: User authentication page
   - Dashboard: Main dashboard with stats and transactions
   - Analytics: Data visualization page
   - Settings: User settings page

2. **UI Components**:
   - Shadcn/UI components (Button, Card, Table, etc.)
   - Custom components (Sidebar, DashboardLayout, etc.)
   - Data visualization components (ChartPlaceholder)

3. **Hooks**:
   - `useAuth`: Authentication state management
   - `useToast`: Toast notifications
   - `useMobile`: Responsive design detection

### Backend Components
1. **Express Server**: Main application server
2. **API Routes**: 
   - Authentication (login/logout)
   - User data
   - Transactions
   - Stats
3. **Storage Service**: Interface for data persistence
4. **Vite Integration**: Development server configuration

## Data Flow

1. **Authentication Flow**:
   - User submits credentials via login form
   - Frontend sends request to `/api/login` endpoint
   - Backend validates credentials against stored user data
   - On success, user data is returned and stored in React state
   - Protected routes check authentication status via `useAuth` hook

2. **Data Fetching**:
   - React Query handles API requests and caching
   - Components request data based on route/user actions
   - Backend retrieves data from database via Drizzle ORM
   - Data is returned as JSON and rendered in UI components

3. **State Management**:
   - Global auth state managed via Context API
   - UI state (toasts, modals) managed via custom hooks
   - Form state handled with React's built-in state

## External Dependencies

### Frontend
- **Core**: React, TypeScript
- **UI**: Radix UI primitives, shadcn/ui components, Tailwind CSS
- **Data**: TanStack React Query, Zod for validation
- **Animation**: Framer Motion
- **Routing**: Wouter

### Backend
- **Core**: Express, Node.js
- **Database**: Drizzle ORM with PostgreSQL
- **Development**: Vite, ESBuild

## Deployment Strategy

The application is configured for deployment with:

1. **Build Process**:
   - Frontend: Vite builds static assets to `dist/public`
   - Backend: ESBuild bundles server code to `dist`

2. **Server Configuration**:
   - Production server runs from `dist/index.js`
   - Static assets served from `dist/public`

3. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: Environment mode (development/production)

4. **Database Setup**:
   - Schema defined in `shared/schema.ts`
   - Migrations managed via Drizzle Kit

## Database Schema

The application uses three main tables:

1. **Users Table**:
   - Basic user information (username, password, email)
   - Authentication data
   - Admin flag

2. **Transactions Table**:
   - Transaction records with customer data
   - Transaction status and amount
   - Date information

3. **Stats Table**:
   - Aggregated business metrics
   - Trend indicators and values
   - Revenue, user, and conversion data

## Getting Started

1. Set up PostgreSQL database and configure `DATABASE_URL`
2. Run `npm run db:push` to initialize database schema
3. Start development server with `npm run dev`
4. Access the application at http://localhost:5000

## Key Development Tasks

1. **Authentication Enhancements**:
   - Implement proper password hashing
   - Add JWT or session-based auth persistence
   - Create user registration functionality

2. **Database Integration**:
   - Connect to real PostgreSQL database
   - Implement remaining CRUD operations
   - Add data validation and error handling

3. **Frontend Features**:
   - Complete dashboard data visualization
   - Add user profile management
   - Implement responsive design improvements

4. **Testing**:
   - Add unit tests for components and hooks
   - Add API integration tests
   - Set up end-to-end testing