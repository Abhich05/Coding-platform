# HireRight Backend Server

Backend API for the HireRight Platform - A modern hiring and technical assessment platform.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── assessmentController.js
│   │   ├── problemController.js
│   │   └── submissionController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   ├── Problem.js
│   │   └── Submission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── problemRoutes.js
│   │   ├── submissionRoutes.js
│   │   └── index.js
│   ├── middlewares/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Error handling
│   │   └── rateLimiter.js        # Rate limiting
│   └── server.js                 # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your configuration:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT signing
   - `PORT` - Server port (default: 5000)

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user (protected)
- `PUT /profile` - Update profile (protected)

### Assessments (`/api/v1/assessments`)

- `GET /` - Get all assessments (protected)
- `POST /` - Create assessment (recruiter/admin)
- `GET /:id` - Get single assessment (protected)
- `PUT /:id` - Update assessment (recruiter/admin)
- `DELETE /:id` - Delete assessment (recruiter/admin)
- `POST /:id/candidates` - Add candidate (recruiter/admin)
- `GET /:id/stats` - Get assessment statistics (protected)

### Problems (`/api/v1/problems`)

- `GET /` - Get all problems (protected)
- `POST /` - Create problem (recruiter/admin)
- `GET /:id` - Get single problem (protected)
- `PUT /:id` - Update problem (recruiter/admin)
- `DELETE /:id` - Delete problem (recruiter/admin)

### Submissions (`/api/v1/submissions`)

- `POST /` - Submit code (public)
- `POST /complete` - Complete assessment (public)
- `POST /flag` - Flag suspicious activity (public)
- `GET /assessment/:assessmentId/candidate/:email` - Get candidate submissions
- `GET /assessment/:assessmentId` - Get all submissions (protected)

## Database Models

### User
- name, email, password, role (admin/recruiter/candidate)
- Authentication with JWT and bcrypt

### Assessment
- title, description, problems, duration, status
- Embedded candidates array
- Settings for proctoring

### Problem
- title, description, difficulty, language
- starterCode, solution, testCases
- Tags and constraints

### Submission
- Assessment and candidate references
- Code submissions history
- Test results and scoring
- Proctoring flags

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet for security headers
- CORS configuration
- Input validation

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hireright
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

## Future Enhancements

- [ ] Code execution engine integration
- [ ] Email service for candidate invitations
- [ ] File upload for candidate profiles
- [ ] Advanced analytics and reporting
- [ ] Webhooks for integrations
- [ ] Real-time proctoring with WebSockets

## License

MIT
