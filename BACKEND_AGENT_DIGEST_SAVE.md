# Backend Agent - Save to Digest Verification

**Copy and paste this entire prompt to the Backend Agent**

---

You are the Backend Agent for Policy Radar. You need to **verify** that the backend API supports "Save to Digest" functionality.

## 🎯 Current Status

**User Request**: Users want a "Save to Digest" button

**Backend Status**: ✅ API endpoints exist and should work

---

## ✅ Backend API Endpoints (Verify These Work)

### Endpoint 1: Save Policy
**Route**: `POST /api/saved/{policy_id}`  
**Status**: ✅ Should be implemented

**Expected Behavior**:
- Toggles saved status for policy
- Returns: `{ "saved": true }` or `{ "saved": false }`

**Verify**:
```bash
curl -X POST http://localhost:8000/api/saved/1 \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
```

**Expected Response**: `{"saved": true}` or `{"saved": false}`

---

### Endpoint 2: Digest Preview
**Route**: `POST /api/digest/preview`  
**Status**: ✅ Should be implemented

**Expected Behavior**:
- Generates top 5 policies by impact score
- Returns: `{ "top5": [...], "generated_at": "..." }`

**Verify**:
```bash
curl -X POST http://localhost:8000/api/digest/preview \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response**: `{"top5": [...], "generated_at": "..."}`

---

## 🔍 Verification Steps

### Step 1: Verify Save Endpoint

```bash
cd PolicyRadar-backend
source venv/bin/activate

# Test save endpoint
curl -X POST http://localhost:8000/api/saved/1 \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
```

**Expected**: `{"saved": true}` or `{"saved": false}` ✅

### Step 2: Verify Digest Preview Endpoint

```bash
# Test digest preview
curl -X POST http://localhost:8000/api/digest/preview \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected**: `{"top5": [...], "generated_at": "..."}` ✅

### Step 3: Test Save Then Digest Flow

```bash
# Step 1: Save a policy
curl -X POST http://localhost:8000/api/saved/1 \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"

# Step 2: Get digest preview
curl -X POST http://localhost:8000/api/digest/preview \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected**: Both endpoints work ✅

---

## 🚨 If Endpoints Don't Work

### If Save Endpoint Returns 500

**Check**:
1. Is route implemented in `app/api/routes.py`?
2. Is database connection working?
3. Are there any errors in logs?

**Fix**:
1. Check `app/api/routes.py` for `/saved/{policy_id}` route
2. Verify database session is working
3. Check error logs

### If Digest Preview Returns 500

**Check**:
1. Is route implemented in `app/api/routes.py`?
2. Is the digest preview logic working?
3. Are there any errors in logs?

**Fix**:
1. Check `app/api/routes.py` for `/digest/preview` route
2. Verify digest calculation logic works
3. Check error logs

---

## 📋 Verification Checklist

- [ ] Save endpoint (`POST /api/saved/{id}`) works
- [ ] Digest preview endpoint (`POST /api/digest/preview`) works
- [ ] Both endpoints return correct response format
- [ ] No 500 errors
- [ ] API key authentication works
- [ ] Database operations succeed

---

## 🚀 After Verification

1. **Confirm endpoints work**: Both save and digest endpoints functional
2. **If endpoints broken**: Fix backend issues
3. **If endpoints work**: Notify Frontend Agent that backend is ready
4. **Update status**: Document verification results

---

## 📚 Reference Documents

- **API Contract**: `/contracts/openapi.yml`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**Verify endpoints work, then Frontend Agent can implement the button!**

**Test endpoints manually to ensure they're functional!** 🧪✅

