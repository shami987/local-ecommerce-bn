# Project Documentation

## What I Built

I created a **Local E-commerce Authentication Backend** - a REST API that handles user registration and login for an e-commerce application.

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework for building APIs
- **MongoDB Atlas** - Cloud database for storing user data
- **Mongoose** - MongoDB object modeling tool
- **JWT (JSON Web Tokens)** - Secure user authentication
- **Bcrypt** - Password hashing for security
- **Swagger** - Interactive API documentation

## Project Structure

```
local-backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection setup
│   │   └── swagger.ts       # Swagger documentation config
│   ├── controllers/
│   │   └── authController.ts # Registration & login logic
│   ├── middleware/
│   │   └── auth.ts          # JWT verification middleware
│   ├── models/
│   │   └── User.ts          # User data structure
│   ├── routes/
│   │   └── auth.ts          # API endpoints definition
│   ├── utils/
│   │   ├── jwt.ts           # JWT token utilities
│   │   └── password.ts      # Password hashing utilities
│   └── index.ts             # Main server file
├── .env                     # Environment variables
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Features Implemented

### 1. User Registration
- Users can create an account with name, email, and password
- Passwords are hashed using bcrypt before storing in database
- Returns JWT token upon successful registration
- Prevents duplicate email registrations

### 2. User Login
- Users can login with email and password
- Validates credentials against database
- Returns JWT token for authenticated sessions
- Secure password comparison

### 3. Database Integration
- Connected to MongoDB Atlas (cloud database)
- User data persists across server restarts
- Mongoose schemas for data validation

### 4. Security Features
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Token expires after 24 hours
- Environment variables for sensitive data

### 5. API Documentation
- Interactive Swagger UI at `/api-docs`
- Test endpoints directly from browser
- Complete request/response examples
- No need for Postman during development

## API Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

## How It Works

### Registration Flow
1. User sends name, email, and password to `/api/auth/register`
2. System checks if email already exists in database
3. Password is hashed using bcrypt
4. New user is saved to MongoDB
5. JWT token is generated with user ID
6. Token and user info returned to client

### Login Flow
1. User sends email and password to `/api/auth/login`
2. System finds user by email in database
3. Password is compared with stored hash
4. If valid, JWT token is generated
5. Token and user info returned to client

### Authentication Flow
1. Client includes JWT token in request header: `Authorization: Bearer <token>`
2. Middleware verifies token validity
3. If valid, request proceeds to protected route
4. If invalid, returns 403 Forbidden error

## Development Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

### Installation Steps
1. Clone repository
2. Run `npm install`
3. Create `.env` file with MongoDB URI and JWT secret
4. Run `npm run dev` for development
5. Access API at `http://localhost:3000`
6. View documentation at `http://localhost:3000/api-docs`

## Production Deployment

### Deployed on Render
- Automatic deployment from GitHub
- Environment variables configured in Render dashboard
- Uses compiled JavaScript (`npm start`)
- Production-ready with proper error handling

### Build Process
1. `npm install` - Install dependencies
2. `npm run build` - Compile TypeScript to JavaScript
3. `npm start` - Run compiled code

## Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-here
PORT=3000
```

## Security Considerations

- Passwords never stored in plain text
- JWT tokens expire after 24 hours
- Environment variables for sensitive data
- MongoDB connection string kept private
- CORS can be added for frontend integration

## Future Enhancements

- Email verification
- Password reset functionality
- User profile management
- Role-based access control (admin/user)
- Refresh tokens
- Rate limiting
- Input validation with Joi or Zod

## Testing the API

### Using Swagger UI
1. Start server: `npm run dev`
2. Open browser: `http://localhost:3000/api-docs`
3. Click on endpoint
4. Click "Try it out"
5. Enter test data
6. Click "Execute"
7. View response

### Using cURL
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

## What I Learned

1. Building RESTful APIs with Express and TypeScript
2. Implementing secure authentication with JWT
3. Password hashing and security best practices
4. MongoDB database integration with Mongoose
5. API documentation with Swagger
6. Deploying Node.js applications to production
7. Environment variable management
8. Git version control and GitHub integration

## Conclusion

This project demonstrates a complete authentication system suitable for an e-commerce application. It includes user registration, login, secure password storage, JWT-based authentication, and comprehensive API documentation. The code is production-ready and deployed on Render with MongoDB Atlas as the database.
