# ApniSec Documentation

Welcome to ApniSec! This documentation will help you understand, set up, and use the cybersecurity issue management platform.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Architecture](#project-architecture)
4. [Features](#features)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

ApniSec is a full-stack web application designed to help security teams manage and track cybersecurity issues efficiently. Whether you're dealing with cloud security vulnerabilities, red team assessment findings, or VAPT reports, ApniSec provides a centralized platform to organize, prioritize, and resolve security issues.

### Why ApniSec?

Managing security issues across different teams and tools can be chaotic. ApniSec solves this by:

- Providing a single source of truth for all security issues
- Allowing teams to filter and search through issues quickly
- Tracking issue status from discovery to resolution
- Sending email notifications to keep everyone informed

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT implementation
- **Email**: Resend API
- **Deployment**: Vercel (recommended)

---

## Getting Started

### Prerequisites

Before you begin, make sure you have:

- Node.js 18 or higher installed
- MongoDB installed locally OR a MongoDB Atlas account
- A Resend account for email notifications (optional but recommended)
- Git for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ApniSec
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your actual values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/apnisec
   JWT_SECRET=your-super-secret-key-here
   RESEND_API_KEY=re_your_resend_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   If using MongoDB Atlas, just make sure your connection string is correct in `.env`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000` and you should see the landing page!

---

## Project Architecture

ApniSec follows a clean, object-oriented architecture with clear separation of concerns.

### Folder Structure

```
ApniSec/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── users/                # User management endpoints
│   │   └── issues/               # Issue management endpoints
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── dashboard/                # Main dashboard
│   ├── profile/                  # User profile page
│   └── page.tsx                  # Landing page
├── src/backend/                  # Backend business logic
│   ├── db/                       # Database connection
│   ├── models/                   # Mongoose models
│   ├── repositories/             # Data access layer
│   ├── services/                 # Business logic layer
│   ├── handlers/                 # Request handlers
│   ├── validators/               # Input validation
│   ├── middleware/               # Auth & rate limiting
│   ├── emails/                   # Email templates & service
│   └── errors/                   # Custom error classes
└── public/                       # Static assets
```

### Backend Architecture Pattern

The backend follows a layered architecture:

```
Request → Handler → Service → Repository → Database
            ↓           ↓
        Validator   Middleware
```

**Example Flow:**

1. User makes a request to create an issue
2. **Handler** receives the request and validates input using **Validator**
3. **Middleware** checks authentication
4. **Service** contains the business logic
5. **Repository** interacts with the database
6. Response flows back through the layers

This pattern keeps code organized and makes testing easier.

---

## Features

### 1. User Authentication

**Registration**
- Users can create an account with name, email, and password
- Passwords are hashed using bcrypt before storage
- Welcome email sent upon successful registration

**Login**
- Email and password authentication
- JWT token stored in HTTP-only cookie for security
- Automatic redirect to dashboard on success

**Logout**
- Clears authentication cookie
- Redirects to login page

### 2. Issue Management

**Create Issues**
- Three types: Cloud Security, Red Team Assessment, VAPT
- Four priority levels: Low, Medium, High, Critical
- Required fields: title, description, type, priority

**View Issues**
- Dashboard displays all issues in card format
- Shows priority badges with color coding
- Displays status (Open, In Progress, Resolved, Closed)
- Shows creation date

**Edit Issues**
- Click "Edit" on any issue
- Update title, description, type, priority, or status
- Changes saved immediately

**Delete Issues**
- Click "Delete" with confirmation prompt
- Issue removed from database

### 3. Search and Filtering

**Search**
- Search bar filters issues by title or description
- Real-time filtering as you type

**Filter by Type**
- All Types
- Cloud Security
- Red Team Assessment
- VAPT

**Filter by Priority**
- All Priorities
- Low, Medium, High, Critical

**Filter by Status**
- All Status
- Open, In Progress, Resolved, Closed

**Combined Filtering**
- All filters work together
- Example: Search "SQL" + Filter "Critical" + Status "Open"

### 4. User Profile

**View Profile**
- See your name, email, and join date

**Edit Profile**
- Update name or email
- Receive confirmation email on changes

### 5. Email Notifications

Automated emails are sent for:
- New user registration (welcome email)
- Issue creation
- Profile updates

All emails use professional HTML templates with ApniSec branding.

### 6. Security Features

**Rate Limiting**
- 100 requests per 15 minutes per IP address
- Prevents brute force attacks
- Returns 429 status when limit exceeded

**Password Security**
- Bcrypt hashing with salt
- Minimum 6 characters required
- Never stored in plain text

**JWT Authentication**
- Tokens expire after 7 days
- Stored in HTTP-only cookies (XSS protection)
- Verified on every protected route

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: token=<jwt-token>
```

**Response (200):**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Issue Endpoints

#### Create Issue
```http
POST /api/issues
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "type": "cloud-security",
  "title": "S3 Bucket Misconfiguration",
  "description": "Public read access enabled on production bucket",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "message": "Issue created successfully",
  "issue": {
    "_id": "...",
    "type": "cloud-security",
    "title": "S3 Bucket Misconfiguration",
    "description": "Public read access enabled on production bucket",
    "priority": "high",
    "status": "open",
    "createdBy": "...",
    "createdAt": "2025-01-26T..."
  }
}
```

#### Get All Issues
```http
GET /api/issues?type=cloud-security
Cookie: token=<jwt-token>
```

**Query Parameters:**
- `type` (optional): Filter by issue type

**Response (200):**
```json
{
  "issues": [...]
}
```

#### Get Single Issue
```http
GET /api/issues/:id
Cookie: token=<jwt-token>
```

**Response (200):**
```json
{
  "issue": {...}
}
```

#### Update Issue
```http
PUT /api/issues/:id
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "in-progress"
}
```

**Response (200):**
```json
{
  "message": "Issue updated successfully",
  "issue": {...}
}
```

#### Delete Issue
```http
DELETE /api/issues/:id
Cookie: token=<jwt-token>
```

**Response (200):**
```json
{
  "message": "Issue deleted successfully"
}
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Cookie: token=<jwt-token>
```

**Response (200):**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

#### Update Profile
```http
PUT /api/users/profile
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

---

## Database Schema

### User Model

```javascript
{
  name: String (required, min: 2, max: 100),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Methods:**
- `comparePassword(candidatePassword)` - Compares plain text password with hashed password

### Issue Model

```javascript
{
  type: String (required, enum: ['cloud-security', 'red-team', 'vapt']),
  title: String (required, min: 5, max: 200),
  description: String (required, min: 10, max: 2000),
  priority: String (required, enum: ['low', 'medium', 'high', 'critical']),
  status: String (default: 'open', enum: ['open', 'in-progress', 'resolved', 'closed']),
  createdBy: ObjectId (ref: 'User', required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

---

## Deployment

### Deploying to Vercel

Vercel is the recommended platform for deploying ApniSec.

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables**
   
   In Vercel dashboard, add these variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A strong random string
   - `RESEND_API_KEY` - Your Resend API key
   - `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL

4. **Deploy**
   
   Click "Deploy" and Vercel will build and deploy your app automatically!

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get connection string and add to Vercel environment variables

### Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain)
3. Get API key from dashboard
4. Add to Vercel environment variables

---

## Troubleshooting

### Common Issues

**Problem: MongoDB connection refused**

Solution:
- Make sure MongoDB is running (`mongod` command)
- Check your `MONGODB_URI` in `.env`
- If using Atlas, verify your IP is whitelisted

**Problem: JWT token not working**

Solution:
- Clear browser cookies
- Check `JWT_SECRET` is set in `.env`
- Make sure you're logged in

**Problem: Emails not sending**

Solution:
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for error logs
- Make sure email addresses are valid

**Problem: Rate limit errors**

Solution:
- Wait 15 minutes for rate limit to reset
- Rate limits are per IP address
- In development, restart the server to reset

**Problem: Build fails on Vercel**

Solution:
- Check build logs in Vercel dashboard
- Make sure all environment variables are set
- Try building locally first: `npm run build`

### Getting Help

If you're stuck:

1. Check this documentation first
2. Look at the code comments in the files
3. Check the browser console for errors
4. Review the terminal output for error messages

---

## Best Practices

### For Users

- Use strong passwords (at least 8 characters)
- Log out when done, especially on shared computers
- Regularly update issue statuses to keep the dashboard current
- Use descriptive titles and detailed descriptions for issues

### For Developers

- Never commit `.env` file to version control
- Keep dependencies updated regularly
- Test changes locally before deploying
- Use meaningful commit messages
- Follow the existing code structure and patterns

---

## Future Enhancements

Potential features for future versions:

- **Team Collaboration**: Assign issues to specific team members
- **Comments**: Add discussion threads to issues
- **File Attachments**: Upload screenshots and reports
- **Dashboard Analytics**: Charts and graphs for issue metrics
- **Export Functionality**: Download issues as CSV or PDF
- **Advanced Filtering**: Save custom filter presets
- **Real-time Updates**: WebSocket integration for live updates
- **Mobile App**: Native iOS and Android applications

---
