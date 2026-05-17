# AI-Powered Online Code Judge + Interview Preparation Platform

A full-stack MERN application for solving coding problems with built-in code execution, test case validation, and AI-powered feedback.

## Features
- 🔐 JWT-based authentication
- 💻 In-browser Monaco Editor
- ✅ Test case validation
- � AI code analysis with optional OpenAI integration
- 🏆 Leaderboard and scoring dashboard support
- 🧩 Dynamic admin test case builder (no raw JSON needed)
- 🎯 Difficulty-based filtering
- 👨‍💼 Admin problem management

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Axios, Monaco Editor
- **Security**: JWT, bcryptjs, Helmet, Rate Limiting

## Quick Start

### Option 1: Local Setup (Development)

1. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure Environment**
   ```bash
   cd backend && cp .env.example .env
   cd ../frontend && cp .env.example .env
   ```
   Edit `.env` files with your MongoDB URI and settings.

   If port `3000` is already in use, set `PORT=3001` in `frontend/.env` before starting. The backend accepts local frontend origins during development.

3. **Start MongoDB**
   Ensure MongoDB is running locally on `localhost:27017`

4. **Run Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on http://localhost:5000

5. **Run Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on http://localhost:3000 (or http://localhost:3001 if 3000 is occupied)

### Option 2: Docker Setup (Production)
   ```bash
   docker-compose up --build
   ```
   - MongoDB: http://localhost:27017
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## Admin Setup

Create first admin account:
```bash
cd backend
node seedAdmin.js
```

Login credentials:
- Email: `admin@aijudge.com`
- Password: `Admin@123`

Then navigate to `/admin/problems` to create problems.

## Folder Structure
```
final/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/      # Route handlers
│   ├── middlewares/      # Auth & errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST API endpoints
│   ├── services/        # Code execution & AI
│   ├── seedAdmin.js     # Admin seed script
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # HTML template
│   ├── src/
│   │   ├── api/         # Axios endpoints
│   │   ├── components/  # React pages
│   │   ├── contexts/    # Auth context
│   │   ├── hooks/       # Custom hooks
│   │   ├── styles/      # CSS
│   │   └── App.js       # Main app
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create (admin only)
- `PUT /api/problems/:id` - Update (admin only)
- `DELETE /api/problems/:id` - Delete (admin only)

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions` - Get user submissions
- `GET /api/submissions/:id` - Get submission details

### AI
- `POST /api/ai/analyze` - Analyze code

## Security Notes
- Passwords are hashed with bcrypt
- Rate limiting (120 requests/min per IP)
- Helmet headers enabled
- CORS restricted to frontend URL
- Code execution timeout: 5 seconds
- Optional Docker sandbox support

## Configuration

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-code-judge
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
OPENAI_API_KEY=
USE_DOCKER=false  # Set to true for Docker sandbox
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Notes
- Code execution runs locally by default
- Set `USE_DOCKER=true` in backend `.env` for sandboxed execution
- AI feedback is modular and ready for OpenAI integration
- Admin can create problems with custom test cases
