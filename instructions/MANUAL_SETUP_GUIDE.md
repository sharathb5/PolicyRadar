# Manual Setup Guide - Step by Step

**⚠️ IMPORTANT: This is a public repository. Never commit secrets!**

This guide covers **only** the manual setup steps you need to do. Testing will be handled by the Testing & Assurance Agent.

---

## ✅ Security Check: No Secrets Found

**Good news**: No hardcoded secrets detected in the codebase! ✅
- Only example values found (in documentation/examples)
- Test database URLs are acceptable (test.db)
- All configuration properly uses environment variables

**⚠️ Alert**: Always use `.env` files (which are in `.gitignore`) for secrets. Never commit `.env` files.

---

## Step-by-Step Manual Setup

### Step 1: Backend Database Setup

#### 1.1 Install PostgreSQL (if not already installed)

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify PostgreSQL is running
brew services list | grep postgresql
```

**Note**: If you don't have Homebrew installed, install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 1.2 Create Database

**IMPORTANT**: The commands below have TWO PARTS:
1. **Shell commands** (run in your terminal) - for PATH setup
2. **SQL commands** (run INSIDE psql) - for database setup

**Step 1: Add PostgreSQL to PATH (if needed) - Run in TERMINAL, NOT in psql**

```bash
# Only run this if you get "command not found" when running psql
# Run this in your regular terminal (NOT inside psql)
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Step 2: Connect to PostgreSQL - Run in TERMINAL**

```bash
# Connect to PostgreSQL (default user is your macOS username)
psql postgres

# You should see: postgres=#
# This means you're INSIDE psql now
```

**Step 3: Run SQL Commands - Run INSIDE psql (when you see postgres=#)**

Once you're inside psql (you'll see `postgres=#` prompt), run these SQL commands **ONE AT A TIME**:

```sql
CREATE DATABASE policyradar;
```

Press Enter. You should see: `CREATE DATABASE`

Then run:

```sql
CREATE USER policyradar_user WITH PASSWORD 'your_secure_password_here';
```

Press Enter. Replace `'your_secure_password_here'` with an actual password.

Then run:

```sql
GRANT ALL PRIVILEGES ON DATABASE policyradar TO policyradar_user;
```

Press Enter. You should see: `GRANT`

**Step 4: Exit psql**

```sql
\q
```

This exits psql and returns you to your terminal.

**Note**: 
- Default PostgreSQL user on macOS is usually your macOS username (same as `whoami`)
- Remember your database credentials (username, password) - you'll need them in Step 2.
- The `--` comments in SQL are fine, but you don't need to type them - just the commands

---

### Step 2: Backend Environment Configuration

#### 2.1 Navigate to Backend Directory

```bash
cd "/Users/sharath/Policy Radar/PolicyRadar-backend"
# Or from project root:
cd PolicyRadar-backend
```

#### 2.2 Create `.env` File

```bash
# Create .env file (this file is in .gitignore - will NOT be committed)
touch .env

# Or create and open in editor:
touch .env && open -e .env
```

#### 2.3 Add Environment Variables to `.env`

Open `.env` file and add the following:

```env
# Database Configuration
# Format: postgresql://username:password@host:port/database_name
# Example: postgresql://postgres:your_password@localhost:5432/policyradar
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/policyradar

# API Configuration
# Generate a secure API key (use a random string generator)
# Example: openssl rand -hex 32
API_KEY=your_secure_api_key_here

# Server Configuration (optional - defaults shown)
API_HOST=0.0.0.0
API_PORT=8000

# Ingestion Configuration (optional - for real CPDB source)
# CPDB_API_KEY=your_cpdb_api_key_here
# CPDB_BASE_URL=https://api.climatepolicydatabase.org
INGEST_RATE_LIMIT=1.0

# Logging (optional)
LOG_LEVEL=INFO
```

**⚠️ IMPORTANT**: 
- Replace `your_password` with your actual PostgreSQL password
- Replace `your_secure_api_key_here` with a generated secure key
- Replace database username if different from `postgres`

**Generate a secure API key (macOS):**
```bash
# macOS has openssl built-in
openssl rand -hex 32

# Alternative using macOS's /dev/urandom
head -c 32 /dev/urandom | base64 | tr -d "=+/" | cut -c1-32
```

#### 2.4 Verify `.env` is in `.gitignore`

Check that `.env` is ignored:

```bash
cd PolicyRadar-backend
cat .gitignore | grep -E "^\.env$"
```

If it's not there, add it:
```bash
echo ".env" >> .gitignore
```

---

### Step 3: Backend Dependencies Installation

#### 3.1 Create Virtual Environment (Recommended)

```bash
cd PolicyRadar-backend

# Create virtual environment (macOS uses python3)
python3 -m venv venv

# Activate virtual environment (macOS)
source venv/bin/activate

# Verify activation - prompt should show (venv)
which python
# Should show: .../PolicyRadar-backend/venv/bin/python
```

#### 3.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

### Step 4: Backend Database Migration

#### 4.1 Run Database Migrations

```bash
cd PolicyRadar-backend

# Make sure virtual environment is activated
source venv/bin/activate

# Verify DATABASE_URL is set
echo $DATABASE_URL
# Or check .env file is loaded

# Run Alembic migrations
alembic -c app/db/alembic.ini upgrade head
```

**Expected output**: Should show migration running successfully.

**If you get "command not found" errors:**
- Make sure virtual environment is activated: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`

---

### Step 5: Seed Database (Load Test Data)

#### 5.1 Load Seed Policies

```bash
cd PolicyRadar-backend

# Make sure virtual environment is activated
source venv/bin/activate

# Make sure .env is configured with DATABASE_URL
python3 -m app.db.seed
# Or: python -m app.db.seed (if python points to python3)
```

**Expected output**: Should show "Seeded 12 policies" or similar success message.

**Expected output**: Should load 12 policies from `/contracts/fixtures/seed_policies.json`.

---

### Step 6: Frontend Environment Configuration

#### 6.1 Navigate to Frontend Directory

```bash
cd "/Users/sharath/Policy Radar/policy-radar-frontend"
# Or from project root:
cd policy-radar-frontend
```

#### 6.2 Create `.env.local` File

```bash
# Create .env.local file (this file is in .gitignore - will NOT be committed)
touch .env.local

# Or create and open in editor:
touch .env.local && open -e .env.local
```

#### 6.3 Add Environment Variables to `.env.local`

Open `.env.local` file and add:

```env
# API Base URL (without trailing slash)
# Use http://localhost:8000/api for local development
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# API Key (MUST match the API_KEY in backend .env file)
NEXT_PUBLIC_API_KEY=your_secure_api_key_here

# Feature Flag: Use fixture data instead of real API
# Set to "true" to test frontend without backend running
# Set to "false" to use real backend API
NEXT_PUBLIC_USE_FIXTURES=false
```

**⚠️ IMPORTANT**: 
- `NEXT_PUBLIC_API_KEY` **MUST match** the `API_KEY` you set in backend `.env` file
- For testing without backend: Set `NEXT_PUBLIC_USE_FIXTURES=true`
- For testing with backend: Set `NEXT_PUBLIC_USE_FIXTURES=false`

#### 6.4 Verify `.env.local` is in `.gitignore`

Check that `.env.local` is ignored:

```bash
cd policy-radar-frontend
cat .gitignore | grep -E "\.env"
```

Should see `.env.local` or `.env*` in gitignore.

---

### Step 7: Frontend Dependencies Installation

#### 7.1 Install Node Dependencies

```bash
cd policy-radar-frontend

# Check if you have Node.js installed
node --version
npm --version

# If not installed, install Node.js using Homebrew:
brew install node

# Install dependencies using npm:
npm install

# OR using pnpm (if you prefer - install first):
brew install pnpm
pnpm install

# OR using yarn (if you prefer - install first):
brew install yarn
yarn install
```

---

### Step 8: Verify Setup

#### 8.1 Check Backend Environment

```bash
cd PolicyRadar-backend

# Verify .env file exists
ls -la .env

# Verify .env file has correct values (macOS)
cat .env | grep -v "^#" | grep -v "^$"

# Or open in TextEdit to verify:
open -e .env

# Should see:
# DATABASE_URL=postgresql://...
# API_KEY=...
```

#### 8.2 Check Frontend Environment

```bash
cd policy-radar-frontend

# Verify .env.local file exists
ls -la .env.local

# Verify .env.local file has correct values (macOS)
cat .env.local | grep -v "^#" | grep -v "^$"

# Or open in TextEdit to verify:
open -e .env.local

# Should see:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_API_KEY=...
# NEXT_PUBLIC_USE_FIXTURES=false
```

---

## Quick Start Commands

After setup is complete, you can start the servers:

### Start Backend Server

```bash
cd PolicyRadar-backend

# Activate virtual environment (macOS)
source venv/bin/activate

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Keep this terminal window open - server runs here
```

**Verify backend is running (in a new terminal):**
```bash
# Test root endpoint
curl http://localhost:8000/
# Should return: {"message":"Policy Radar API","version":"1.0.0"}

# Test health endpoint (replace with your API key)
curl -H "X-API-Key: your_secure_api_key_here" http://localhost:8000/api/healthz
# Should return health status JSON
```

**Stop backend server:** Press `Ctrl+C` in the terminal running uvicorn

### Start Frontend Server

```bash
cd policy-radar-frontend

# Start development server (macOS)
npm run dev
# OR
pnpm dev
# OR
yarn dev
```

**Access frontend:**
- Open browser to: `http://localhost:3000`
- Or open automatically: The terminal will show the URL, or you can run:
  ```bash
  open http://localhost:3000
  ```

**Stop frontend server:** Press `Ctrl+C` in the terminal running npm/pnpm/yarn

---

## Security Checklist

Before committing any code, verify:

- [ ] `.env` file is in `.gitignore` (backend)
- [ ] `.env.local` file is in `.gitignore` (frontend)
- [ ] No secrets in code files
- [ ] No hardcoded API keys or passwords
- [ ] Database credentials only in `.env` files
- [ ] API keys only in `.env` files
- [ ] Run: `git status` - verify `.env` files are NOT tracked

**Verify on macOS:**
```bash
# Check .gitignore includes .env files
cd PolicyRadar-backend
grep -E "^\.env$" .gitignore
# Should show: .env

cd ../policy-radar-frontend
grep -E "\.env" .gitignore
# Should show .env.local or .env*

# Verify .env files are NOT tracked
cd ..
git status | grep -E "\.env|\.env\.local"
# Should show nothing (files are ignored)
```

---

## Troubleshooting

### Backend Issues

**Database connection error:**
```bash
# Verify PostgreSQL is running (macOS)
brew services list | grep postgresql
# Should show "started" status

# Check PostgreSQL is ready (macOS)
pg_isready
# Or: psql -l

# Check DATABASE_URL format
# Format: postgresql://user:pass@host:port/db
# macOS default: postgresql://your_macos_username@localhost:5432/policyradar

# Verify database exists (macOS)
psql -l | grep policyradar
```

**Migration error:**
```bash
# Check .env file is loaded (macOS)
cd PolicyRadar-backend
source venv/bin/activate
python3 -c "from app.config import settings; print(settings.database_url)"
# Should show your DATABASE_URL

# Verify database is accessible (macOS)
psql policyradar -c "SELECT 1"
```

**API key authentication error:**
```bash
# Verify API_KEY matches between backend and frontend
# Backend:
cd PolicyRadar-backend
cat .env | grep API_KEY

# Frontend:
cd policy-radar-frontend
cat .env.local | grep NEXT_PUBLIC_API_KEY

# They must be EXACTLY the same value
```

### Frontend Issues

**Cannot connect to backend:**
```bash
# Verify backend is running (macOS)
curl http://localhost:8000/
# Should return: {"message":"Policy Radar API","version":"1.0.0"}

# Check NEXT_PUBLIC_API_URL in .env.local
cd policy-radar-frontend
cat .env.local | grep NEXT_PUBLIC_API_URL
# Should be: http://localhost:8000/api

# Check API keys match
cat .env.local | grep NEXT_PUBLIC_API_KEY
# Must match backend .env API_KEY

# Check CORS (backend allows * origins by default)
# If still having issues, verify backend CORS config in app/main.py
```

**Want to test without backend:**
```bash
# Set NEXT_PUBLIC_USE_FIXTURES=true in .env.local
cd policy-radar-frontend
echo "NEXT_PUBLIC_USE_FIXTURES=true" > .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" >> .env.local
echo "NEXT_PUBLIC_API_KEY=dummy" >> .env.local

# Restart frontend server (Ctrl+C then npm run dev again)
# Frontend will use fixture data from /contracts/fixtures/seed_policies.json
```

---

## Next Steps After Setup

Once setup is complete:
1. ✅ Backend server can start
2. ✅ Frontend server can start
3. ✅ Database is seeded with 12 policies
4. ✅ All environment variables configured

**Testing will be handled by the Testing & Assurance Agent.**

---

## ⚠️ Security Reminders

1. **Never commit `.env` or `.env.local` files**
2. **Never commit API keys or passwords**
3. **Always use environment variables for secrets**
4. **Use strong, random API keys**
5. **Keep database credentials secure**
6. **Review `.gitignore` before committing**

---

**Setup Complete!** 🚀

You can now start both servers and the Testing & Assurance Agent will handle all testing.

