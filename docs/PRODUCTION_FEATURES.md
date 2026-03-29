# 🏆 Elite-Level Competitive Programming Platform

## Production-Grade Features Implemented

### ✅ Enhanced Code Editor (Monaco Editor)
- **VS Code Engine**: Full Monaco Editor integration with IntelliSense
- **Auto-save**: Code automatically saved to localStorage every 2 seconds
- **Keyboard Shortcuts**: 
  - `Ctrl+Enter` to run code
  - `Ctrl+S` to submit
- **Theme Toggle**: Dark/Light mode support
- **Font Size Control**: Adjustable font size (10-24px)
- **Code Formatting**: Auto-format on paste and type
- **Bracket Colorization**: Visual bracket pair matching

### ✅ Docker-Based Code Execution Engine
- **Secure Sandbox**: Docker containers with read-only filesystems
- **Resource Limits**: 
  - CPU: 1 core per execution
  - Memory: Configurable (default 128MB)
  - Time: Configurable timeout (default 2000ms)
- **Network Isolation**: `--network none` for security
- **Multi-Language Support**: Python, JavaScript, Java, C++, TypeScript
- **Process Limits**: Max 50 PIDs per container

### ✅ Real-Time Updates (WebSocket)
- **Live Progress**: See test case execution in real-time
- **Queue Status**: Know when submission is queued/running/completed
- **Instant Results**: Get results immediately after completion
- **Auto-reconnect**: Handles disconnections gracefully

### ✅ Advanced Test Case System
- **Output Comparison Modes**:
  - Default: Exact match with whitespace normalization
  - Float: Compare with tolerance (default 1e-6)
  - Ignore Whitespace: Remove all whitespace
  - Case Insensitive: Ignore case differences
- **Hidden Test Cases**: Protect test inputs/outputs from candidates
- **Test Results UI**: Tabbed interface showing detailed results
- **Error Messages**: Clear feedback on failures

### ✅ Job Queue System (BullMQ + Redis)
- **Async Processing**: Submissions processed in background
- **Scalability**: Support for multiple worker processes
- **Retry Logic**: Automatic retry on transient failures
- **Rate Limiting**: 100 jobs per minute per worker
- **Job History**: Keep last 100 completed jobs

### ✅ Code Templates
- Pre-defined templates for common problem types
- Language-specific boilerplate
- Editable regions marking
- Support for: Python, JavaScript, Java, C++, TypeScript

### ✅ Security Features
- **Input Validation**: Detect dangerous patterns (exec, eval, file ops)
- **Code Limits**: 
  - Max 64KB code size
  - Max 500 lines
  - Max 1000 chars per line
- **Input Sanitization**: Remove null bytes, limit length
- **Seccomp Profiles**: Restrict system calls in containers

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │◄───────►│   Server    │◄───────►│   MongoDB   │
│  (React)    │ HTTP/WS │  (Express)  │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              │
                        ┌─────▼─────┐
                        │   Redis   │
                        │  (Queue)  │
                        └─────┬─────┘
                              │
                        ┌─────▼─────┐
                        │  Worker   │
                        │ (BullMQ)  │
                        └─────┬─────┘
                              │
                        ┌─────▼─────┐
                        │  Docker   │
                        │ (Execute) │
                        └───────────┘
```

## Prerequisites

### Required Services
1. **MongoDB** (v5.0+)
   ```bash
   # Using MongoDB Community Server or Atlas
   ```

2. **Redis** (v6.0+)
   ```bash
   # Windows: Download from Redis website or use WSL
   # Linux/Mac: 
   sudo apt-get install redis-server
   redis-server
   ```

3. **Docker** (v20.0+)
   ```bash
   # Install Docker Desktop (Windows/Mac)
   # Or Docker Engine (Linux)
   docker --version
   ```

## Installation

### Backend Setup
```bash
cd server
npm install

# Ensure .env is configured (see .env.example)
# Start Redis first!
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Server (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:8080

# Redis (Required for queue system)
REDIS_HOST=localhost
REDIS_PORT=6379
MAX_CONCURRENT_JOBS=10

# AI (Optional - for problem generation)
GEMINI_API_KEY=your_gemini_api_key
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Usage

### 1. Start Redis
```bash
# Windows (if installed)
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:latest
```

### 2. Start Backend
```bash
cd server
npm run dev
```

### 3. Start Frontend
```bash
cd client
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:8080
- Backend: http://localhost:5000
- API Health: http://localhost:5000/health

## Testing the System

### Create Sample Problems
```bash
cd server
npm run seed
```

This creates 2 sample problems:
- Two Sum (Easy)
- Reverse String (Easy)

### Test Code Execution

1. Navigate to Problems page
2. Click on a problem
3. Write your solution in the Monaco Editor
4. Click "Run" or press Ctrl+Enter
5. Watch real-time execution progress
6. View detailed test results

## Docker Images Used

The system automatically pulls these images:
- `python:3.10-slim` - For Python execution
- `node:20-slim` - For JavaScript/TypeScript
- `openjdk:17-slim` - For Java
- `gcc:12-slim` - For C++

## Monitoring

### Queue Dashboard
Access BullMQ dashboard at: `http://localhost:5000/admin/queues`
(Feature to be implemented)

### Logs
- Server logs show WebSocket connections
- Worker logs show job processing
- Docker logs show container execution

## Performance

### Metrics
- **Code Execution**: 50ms - 2000ms (depends on code complexity)
- **Queue Processing**: 10 concurrent jobs by default
- **WebSocket**: Real-time updates with <50ms latency
- **Auto-save**: Debounced to every 2 seconds

### Scaling
To scale workers:
```bash
# Increase MAX_CONCURRENT_JOBS in .env
MAX_CONCURRENT_JOBS=20

# Or run multiple worker instances
node src/services/submissionQueue.js
```

## Security Considerations

### Production Deployment
1. **Use Redis Password**:
   ```env
   REDIS_URL=redis://:password@localhost:6379
   ```

2. **Enable Docker Security**:
   - Use seccomp profiles
   - Enable AppArmor/SELinux
   - Run Docker in rootless mode

3. **Rate Limiting**:
   - Already implemented: 100 submissions/minute
   - Adjust in code if needed

4. **Input Validation**:
   - Already blocks dangerous patterns
   - Customize in `codeValidator.js`

## Troubleshooting

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution**: Start Redis server before the backend

### Docker Permission Error
```
Error: Cannot connect to Docker daemon
```
**Solution**: 
- Ensure Docker Desktop is running
- Add user to docker group (Linux)

### WebSocket Not Connecting
```
WebSocket connection error
```
**Solution**:
- Check CORS settings
- Verify FRONTEND_URL in .env
- Check firewall rules

## API Endpoints

### Submissions
- `POST /api/v1/submissions` - Submit code
  ```json
  {
    "assessmentId": "...",
    "candidateEmail": "...",
    "problemId": "...",
    "code": "...",
    "language": "python"
  }
  ```
  Response:
  ```json
  {
    "success": true,
    "data": {
      "submissionId": "abc123",
      "status": "queued"
    }
  }
  ```

### WebSocket Events
- **Client → Server**:
  - `subscribe_submission` - Subscribe to submission updates
  - `unsubscribe_submission` - Unsubscribe

- **Server → Client**:
  - `submission_update` - Progress/completion updates
    ```json
    {
      "type": "progress|completed",
      "submissionId": "abc123",
      "status": "running|completed",
      "progress": { "currentTest": 2, "totalTests": 5 },
      "result": { "verdict": "Accepted", ... }
    }
    ```

## Future Enhancements

- [ ] Code execution in Go/Rust for better performance
- [ ] Custom judge logic support
- [ ] Plagiarism detection
- [ ] Code replay/debugging tools
- [ ] Performance benchmarking
- [ ] Leaderboard integration
- [ ] Contest mode with time limits

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License - See LICENSE file for details
