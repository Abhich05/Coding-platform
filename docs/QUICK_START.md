# 🚀 Quick Start Guide

## Prerequisites Check
```bash
# Check Node.js (v18+)
node --version

# Check Docker
docker --version

# Check MongoDB (running)
# If using Atlas, skip this

# Check Redis (must install)
redis-cli ping
# Should return: PONG
```

## Step 1: Install Redis

### Windows
```powershell
# Option 1: Using Chocolatey
choco install redis-64

# Option 2: Download from GitHub
# https://github.com/microsoftarchive/redis/releases
# Extract and run redis-server.exe

# Option 3: Docker (Easiest)
docker run -d --name redis -p 6379:6379 redis:latest
```

### Mac
```bash
brew install redis
brew services start redis
```

### Linux
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

## Step 2: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## Step 3: Configure Environment

### server/.env
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
REDIS_HOST=localhost
REDIS_PORT=6379
MAX_CONCURRENT_JOBS=10
GEMINI_API_KEY=your_gemini_key_optional
```

### client/.env
```env
VITE_API_URL=http://localhost:5000
```

## Step 4: Seed Sample Data

```bash
cd server
npm run seed
```

This creates:
- System user (system@hireright.com)
- 2 sample problems (Two Sum, Reverse String)

## Step 5: Start Services

### Terminal 1: Redis (if not using Docker)
```bash
redis-server
```

### Terminal 2: Backend
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running in development mode on port 5000
📡 WebSocket server initialized
```

### Terminal 3: Frontend
```bash
cd client
npm run dev
```

Access: http://localhost:8080

## Step 6: Test the System

1. **Register/Login**
   - Go to Dashboard
   - Click "Register" if no account
   - Login with your credentials

2. **View Problems**
   - Click "Problems" in header
   - See 2 sample problems

3. **Test Code Editor**
   - Click on "Two Sum" problem
   - You'll see Monaco Editor
   - Try the sample solution:

   ```python
   def countPairs(n):
       return n // 2

   if __name__ == "__main__":
       n = int(input())
       print(countPairs(n))
   ```

4. **Run Code**
   - Press "Run" or Ctrl+Enter
   - Watch real-time progress modal
   - See test results

5. **Create Assessment**
   - Go back to Dashboard
   - Click "Create Assessment"
   - Select problems
   - Add candidate email
   - Create

## Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:5000/health
```

### Check Redis
```bash
redis-cli ping
# Should return: PONG
```

### Check WebSocket
Open browser console on frontend, you should see:
```
✅ WebSocket connected
```

### Check Docker
```bash
docker ps
# Should show running containers when code executes
```

## Common Issues

### Issue: Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping

# Start Redis
redis-server

# Or use Docker
docker start redis
```

### Issue: Docker Not Found
```bash
# Install Docker Desktop
# Windows: https://www.docker.com/products/docker-desktop
# Mac: brew install --cask docker
# Linux: sudo apt-get install docker.io
```

### Issue: MongoDB Connection Failed
- Check your MongoDB Atlas connection string
- Ensure IP whitelist includes your IP
- Verify credentials are correct

### Issue: Port Already in Use
```bash
# Change ports in .env files
# Backend: PORT=5001
# Frontend: Update vite.config.ts port
```

## Next Steps

1. **Add More Problems**
   - Use AI generation (if Gemini key configured)
   - Or manually create via UI

2. **Test All Languages**
   - Try Python, JavaScript, Java, C++ samples

3. **Monitor Execution**
   - Watch Docker containers: `docker ps`
   - Check Redis queue: `redis-cli`
   - View server logs

4. **Create Assessments**
   - Add multiple problems
   - Invite candidates
   - Monitor submissions

## Production Deployment

### Docker Compose (Recommended)
```yaml
# docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
  
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - REDIS_HOST=redis
    depends_on:
      - redis
  
  frontend:
    build: ./client
    ports:
      - "8080:8080"
```

```bash
docker-compose up -d
```

### Kubernetes
See `PRODUCTION_FEATURES.md` for Kubernetes deployment configuration.

## Support

- Documentation: `/PRODUCTION_FEATURES.md`
- Issues: Create GitHub issue
- Email: support@hireright.com (replace with actual)

## Success Checklist

- [ ] Redis running and responding to ping
- [ ] MongoDB connected
- [ ] Backend server started
- [ ] Frontend accessible
- [ ] WebSocket connected
- [ ] Sample problems created
- [ ] Can login/register
- [ ] Code execution works
- [ ] Test results appear
- [ ] Real-time updates working

If all checkboxes are ✅, you're ready to go! 🎉
