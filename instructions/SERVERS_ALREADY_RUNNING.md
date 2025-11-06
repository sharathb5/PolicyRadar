# Servers Already Running - Quick Guide

**Status**: ✅ **Servers are already running!**

---

## 🎯 Quick Answer

**The backend and frontend servers are already running!**

You can:
- ✅ **Just open the app** in your browser: `http://localhost:3000`
- ✅ **Use the existing servers** - no need to start new ones
- ✅ **Verify they're working** (see below)

---

## ✅ Verify Servers Are Working

### Test Backend (Port 8000)

```bash
# Test root endpoint
curl http://localhost:8000/

# Should return: {"message":"Policy Radar API","version":"1.0.0"}

# Test health endpoint
curl -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d" \
  http://localhost:8000/api/healthz

# Should return: {"status":"healthy","database":"connected",...}
```

### Test Frontend (Port 3000)

```bash
# Test frontend
curl http://localhost:3000/

# Should return HTML (Next.js page)
```

**Or just open in browser**: `http://localhost:3000`

---

## 🎯 What to Do Now

### Option 1: Use Existing Servers (Recommended) ✅

**Just open your browser**:
```
http://localhost:3000
```

**The app should be fully functional!**

---

### Option 2: Restart Servers (If Needed)

If you want to restart the servers, first stop the existing ones:

#### Stop Backend (Port 8000)

```bash
# Find the process
lsof -i :8000

# Kill the process (replace PID with actual process ID)
kill <PID>

# Or kill all Python processes running uvicorn (be careful!)
pkill -f "uvicorn app.main:app"
```

#### Stop Frontend (Port 3000)

```bash
# Find the process
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill <PID>

# Or kill all Node processes running next (be careful!)
pkill -f "next dev"
```

#### Then Restart

```bash
# Terminal 1 - Backend
cd PolicyRadar-backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd policy-radar-frontend
npm run dev
```

---

## 🔍 Check What's Running

### Check Port 8000 (Backend)

```bash
lsof -i :8000
```

**Expected output**:
```
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
python   1234  sharath  3u  IPv4  ...      0t0  TCP *:8000 (LISTEN)
```

### Check Port 3000 (Frontend)

```bash
lsof -i :3000
```

**Expected output**:
```
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node     5678  sharath  3u  IPv4  ...      0t0  TCP *:3000 (LISTEN)
```

---

## ✅ Quick Test

### 1. Test Backend

```bash
curl http://localhost:8000/
# Should return: {"message":"Policy Radar API","version":"1.0.0"}
```

### 2. Test Frontend

Open browser: `http://localhost:3000`

You should see:
- ✅ Policy Radar header
- ✅ Filter sidebar
- ✅ Policy list (12 policies)
- ✅ All functionality working

---

## 🎯 Bottom Line

**If servers are already running, you can use them immediately!**

1. ✅ **Open**: `http://localhost:3000` in your browser
2. ✅ **Use the app** - everything should work
3. ✅ **No need to start new servers** unless you want to restart

**The app is ready to use right now!** 🚀

---

## ⚠️ If You Want to Restart

Only restart if:
- You want to see server startup logs
- You've made changes that require restart
- The servers seem unresponsive

**Otherwise, just use the existing servers!**

---

## 📝 Quick Commands

### Just Use Existing Servers
```bash
# Open in browser
open http://localhost:3000
# or
http://localhost:3000
```

### Restart If Needed
```bash
# Stop backend
pkill -f "uvicorn app.main:app"

# Stop frontend
pkill -f "next dev"

# Then restart (see Option 2 above)
```

---

**Bottom Line: Servers are already running - just open `http://localhost:3000` and use the app!** ✅

