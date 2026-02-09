# Project Documentation (Simple Version)

## What I Built

I built a **login and registration system** for an online shop. It's like the "Sign Up" and "Login" buttons you see on websites.

## What It Does

### 1. Register (Sign Up)
- New users can create an account
- They give: name, email, password
- Password is encrypted (hidden) for safety
- User gets a special key (token) to stay logged in

### 2. Login
- Existing users can log in
- They give: email, password
- System checks if it's correct
- User gets a special key (token) to stay logged in

### 3. Database
- All user information is saved in MongoDB (like Excel in the cloud)
- Data doesn't disappear when server restarts

## Technologies (Tools I Used)

- **Node.js** - Runs JavaScript on the server
- **TypeScript** - JavaScript with extra safety checks
- **Express** - Makes building websites easier
- **MongoDB** - Database (stores user data)
- **JWT** - Creates special keys for logged-in users
- **Bcrypt** - Hides passwords so hackers can't read them
- **Swagger** - Creates a test page for the API

## Folder Structure (How Files Are Organized)

```
local-backend/
├── src/
│   ├── controllers/     # Brain (handles login/register logic)
│   ├── models/          # Blueprint (what user data looks like)
│   ├── routes/          # Roads (where to send requests)
│   ├── utils/           # Tools (password hiding, token making)
│   └── index.ts         # Main file (starts everything)
├── .env                 # Secrets (passwords, database link)
└── package.json         # List of tools needed
```

## How It Works (Step by Step)

### When Someone Registers:
1. User fills form: name, email, password
2. System checks: "Does this email already exist?"
3. If no: Hide the password (encrypt it)
4. Save user to database
5. Give user a special key (token)
6. User is now registered!

### When Someone Logs In:
1. User enters: email, password
2. System finds user in database
3. System checks: "Is password correct?"
4. If yes: Give user a special key (token)
5. User is now logged in!

### The Special Key (Token):
- Like a movie ticket - proves you paid (logged in)
- Valid for 24 hours
- User sends this key with every request
- Server checks: "Is this key real?"

## API Endpoints (Website Addresses)

### Register New User
**Address:** `POST /api/auth/register`

**Send this:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Get back:**
```json
{
  "message": "User registered successfully",
  "token": "abc123xyz...",
  "user": {
    "id": "12345",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Login
**Address:** `POST /api/auth/login`

**Send this:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get back:**
```json
{
  "message": "Login successful",
  "token": "abc123xyz...",
  "user": {
    "id": "12345",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

## How to Run It

### On Your Computer:
1. Open terminal
2. Type: `npm install` (downloads tools)
3. Create `.env` file with database link
4. Type: `npm run dev` (starts server)
5. Open browser: `http://localhost:3000/api-docs`
6. Test the API!

### On Internet (Render):
1. Push code to GitHub
2. Render automatically builds and runs it
3. Anyone can use it online

## Security (How It's Safe)

1. **Passwords are hidden** - Even I can't see real passwords
2. **Special keys expire** - Token only works for 24 hours
3. **Secrets are hidden** - Database password in `.env` file
4. **Can't register twice** - Same email can't register again

## Testing (How to Check If It Works)

### Easy Way (Swagger):
1. Go to: `http://localhost:3000/api-docs`
2. Click "Register"
3. Click "Try it out"
4. Fill in name, email, password
5. Click "Execute"
6. See if it works!

### Command Line Way:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

## Files Explained

- **index.ts** - Main file, starts the server
- **authController.ts** - Has register and login code
- **User.ts** - Describes what a user looks like
- **auth.ts (routes)** - Defines /register and /login addresses
- **password.ts** - Hides and checks passwords
- **jwt.ts** - Creates and checks special keys
- **.env** - Stores secrets (database link, JWT secret)

## What I Learned

1. How to build login/register system
2. How to hide passwords safely
3. How to save data in database
4. How to create special keys (tokens)
5. How to make API documentation
6. How to put website online

## Simple Summary

I built a system where:
- People can create accounts (register)
- People can log in
- Passwords are safe (encrypted)
- Users get special keys to stay logged in
- Everything is saved in database
- It's online and anyone can use it

It's like building the "Sign Up" and "Login" buttons for a website!
