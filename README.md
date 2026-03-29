# TEST-PLATFORM

## Local Setup (Windows)

### Quick bootstrap (recommended)

From the project root, run:

```powershell
npm run setup
```

This installs `client` and `server` dependencies, then creates `server/.env` from `server/.env.example` if missing.

Run both backend and frontend together from the root:

```powershell
npm run dev
```

### 1) Install dependencies

```powershell
cd client
npm install

cd ..\server
npm install
```

### 2) Install and run MongoDB locally

Install MongoDB Community Server:

```powershell
winget install --id MongoDB.Server --exact --accept-package-agreements --accept-source-agreements --silent
```

Start MongoDB service:

```powershell
Start-Service MongoDB
```

Check MongoDB status:

```powershell
Get-Service MongoDB
Test-NetConnection 127.0.0.1 -Port 27017
```

### 3) Server environment

Copy `server/.env.example` to `server/.env`, then update values as needed.

```powershell
Copy-Item server/.env.example server/.env
```

Or from the server folder, auto-create it only if missing:

```powershell
cd server
npm run setup:env
```

Default `server/.env.example` values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/test_platform
MONGO_DB_NAME=test_platform
JWT_SECRET=replace_with_a_strong_secret
PORT=4000
```

### 4) Run backend

```powershell
cd server
npm run start
```

Expected logs:
- MongoDB Connected Successfully
- Server running on http://localhost:4000

### 5) Run frontend

```powershell
cd client
npm run dev
```