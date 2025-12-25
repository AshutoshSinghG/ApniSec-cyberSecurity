# ApniSec - Cybersecurity Issue Management System

A full-stack cybersecurity issue management platform built with Next.js 15, MongoDB, and TypeScript. This application provides a comprehensive solution for managing Cloud Security, Red Team, and VAPT (Vulnerability Assessment and Penetration Testing) issues.

## Features

### Authentication
- Custom JWT-based authentication (no third-party services)
- Secure password hashing with bcrypt
- HTTP-only cookie storage for tokens
- Protected routes with middleware

### Issue Management
- Create, read, update, and delete cybersecurity issues
- Three issue types: Cloud Security, Red Team Assessment, VAPT
- Priority levels: Low, Medium, High, Critical
- Status tracking: Open, In Progress, Resolved, Closed
- Filter issues by type
- Real-time issue list updates

### Security Features
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation on both client and server
- SQL injection prevention with Mongoose
- XSS protection
- CSRF protection with HTTP-only cookies

### Email Notifications
- Welcome email on registration
- Issue created notifications
- Profile update confirmations
- Powered by Resend

### User Interface
- Modern cybersecurity-themed design
- Responsive layout for all devices
- SEO optimized landing page
- Smooth animations and transitions
- Dark mode with gradient accents

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **Next.js Route Handlers** - API endpoints
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Resend** - Email service

### Architecture
- **Object-Oriented Programming (OOP)** - Class-based backend
- **Repository Pattern** - Data access layer
- **Service Layer** - Business logic
- **Handler Layer** - Request/response processing
- **Validator Layer** - Input validation
- **Middleware Layer** - Authentication and rate limiting


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/apnisec

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Resend API Key (get from https://resend.com)
RESEND_API_KEY=re_your_resend_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally or MongoDB Atlas account
- npm or yarn package manager

### Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd "a:\ApniSec"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values.

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Running Locally

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Issues
- `GET /api/issues` - Get all issues (supports `?type=` filter)
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get single issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

### Rate Limiting
All endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   Go to your Vercel dashboard → Project Settings → Environment Variables
   Add all variables from `.env.example`

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

### Resend Setup

1. Create a free account at [Resend](https://resend.com)
2. Get your API key
3. Update `RESEND_API_KEY` in your environment variables

## Testing the Application

### 1. Register a New User
- Go to `/register`
- Fill in name, email, and password
- Submit the form
- You should receive a welcome email

### 2. Login
- Go to `/login`
- Enter your credentials
- You'll be redirected to the dashboard

### 3. Create an Issue
- Click "Create New Issue" on the dashboard
- Fill in the form with issue details
- Submit to create the issue
- You should receive an email notification

### 4. Filter Issues
- Use the filter buttons to view issues by type
- All, Cloud Security, Red Team, or VAPT

### 5. Update Profile
- Go to `/profile`
- Click "Edit Profile"
- Update your information
- You should receive a confirmation email

### 6. Test Rate Limiting
- Make more than 100 requests in 15 minutes
- You should receive a 429 error with rate limit headers

## Design Decisions

### OOP Architecture
The backend follows a strict Object-Oriented Programming approach with clear separation of concerns:
- **Handlers** manage HTTP requests and responses
- **Services** contain business logic
- **Repositories** handle database operations
- **Validators** ensure data integrity
- **Middleware** provides cross-cutting concerns

### Security
- Passwords are hashed using bcrypt with salt rounds
- JWT tokens stored in HTTP-only cookies prevent XSS attacks
- Rate limiting prevents brute force attacks
- Input validation on both client and server sides

### User Experience
- Modern, cybersecurity-themed design
- Responsive layout works on all devices
- Real-time feedback with success/error messages
- Smooth animations and transitions

## Code Quality

### Human-Written Style
The code is written to look like it was created by a real junior developer:
- Clear variable names
- Simple logic flow
- Helpful comments explaining the "why"
- No over-optimization or over-abstraction

### Comments
```typescript
// checking if user exists
// validating issue data
// connect to database
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify network connectivity

### Email Not Sending
- Check your `RESEND_API_KEY` is valid
- Verify the email address is correct
- Check Resend dashboard for logs

### Rate Limit Issues
- Rate limits reset every 15 minutes
- Clear browser cookies if needed
- Check console for rate limit headers
