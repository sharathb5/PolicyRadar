# Backend Agent - Save Button Debug & Verification

**Copy and paste this entire prompt to the Backend Agent**

---

You are the Backend Agent for Policy Radar. The save button is not working - **NO console response when clicked**. You need to verify the backend API is working correctly.

## 🚨 Critical Issue

**Status**: 🔴 **NEEDS VERIFICATION**  
**User Report**: "When I click the save button there is no console response or anything"

**Frontend is investigating**, but you need to ensure backend API is working correctly.

---

## 🔴 CRITICAL TASK: Verify Save API Endpoint

**Status**: 🔴 **VERIFICATION NEEDED**  
**Time**: ~15 minutes  
**Impact**: Backend may be causing save button to fail silently

### Problem

The save button produces no response. This could be:
1. **Backend API not responding** - Endpoint not working
2. **API key verification failing** - 401 errors being silently caught
3. **Database errors** - 500 errors being silently caught
4. **CORS issues** - Preflight requests failing
5. **Route not found** - 404 errors being silently caught

---

## 🔍 Verification Steps

### Step 1: Test Save Endpoint Directly

**Run this command**:
```bash
cd PolicyRadar-backend
source venv/bin/activate

# Test save endpoint
curl -v -X POST http://localhost:8000/api/saved/1 \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d" \
  -H "Content-Type: application/json"
```

**Expected Output**:
```
* Connected to localhost (127.0.0.1) port 8000
> POST /api/saved/1 HTTP/1.1
> Host: localhost:8000
> X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
> Content-Type: application/json
>
< HTTP/1.1 200 OK
< content-type: application/json
< content-length: 15
<
{"saved":true}
```

**If error occurs**:
- Check backend server is running
- Verify API key in `.env` matches request
- Check database connection
- Check for errors in backend logs

### Step 2: Check API Key Verification

**File**: `PolicyRadar-backend/app/api/routes.py`

**Verify `verify_api_key` function** (around line 20):
```python
def verify_api_key(x_api_key: str = Header(...)):
    """Verify API key."""
    if x_api_key != settings.api_key:
        print(f"❌ API key mismatch: received={x_api_key[:10]}..., expected={settings.api_key[:10]}...")
        raise HTTPException(status_code=401, detail="Invalid API key")
    print(f"✅ API key verified: {x_api_key[:10]}...")
    return x_api_key
```

**Check**:
- Is `settings.api_key` loaded from `.env`?
- Does API key match frontend `.env.local`?
- Are 401 errors being logged?

### Step 3: Check Save Route Implementation

**File**: `PolicyRadar-backend/app/api/routes.py`

**Verify `toggle_saved` route** (around line 192):
```python
@router.post("/saved/{policy_id}", response_model=SavedToggleResponse)
async def toggle_saved(
    policy_id: int,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Toggle saved status for a policy."""
    print(f"🟡 toggle_saved called: policy_id={policy_id}")
    
    # Check if policy exists
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        print(f"❌ Policy not found: policy_id={policy_id}")
        raise HTTPException(status_code=404, detail="Policy not found")
    
    print(f"✅ Policy found: policy_id={policy_id}, title={policy.title}")
    
    # Check if already saved
    saved = db.query(SavedPolicy).filter(SavedPolicy.policy_id == policy_id).first()
    
    if saved:
        # Delete
        print(f"🟡 Removing saved policy: policy_id={policy_id}")
        db.delete(saved)
        db.commit()
        print(f"✅ Saved policy removed: policy_id={policy_id}")
        return SavedToggleResponse(saved=False)
    else:
        # Create
        print(f"🟡 Adding saved policy: policy_id={policy_id}")
        new_saved = SavedPolicy(policy_id=policy_id)
        db.add(new_saved)
        db.commit()
        print(f"✅ Saved policy added: policy_id={policy_id}")
        return SavedToggleResponse(saved=True)
```

**Check**:
- Is database connection working?
- Are there any database errors?
- Is route registered correctly?
- Are exceptions being logged?

### Step 4: Add Request Logging

**File**: `PolicyRadar-backend/app/api/routes.py`

**Add logging middleware** (at top of file):
```python
import logging

logger = logging.getLogger(__name__)

# Add at start of toggle_saved function
@router.post("/saved/{policy_id}", response_model=SavedToggleResponse)
async def toggle_saved(
    policy_id: int,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Toggle saved status for a policy."""
    logger.info(f"POST /api/saved/{policy_id} - Request received")
    
    try:
        # ... existing code ...
        logger.info(f"POST /api/saved/{policy_id} - Success: saved={result.saved}")
        return result
    except Exception as e:
        logger.error(f"POST /api/saved/{policy_id} - Error: {str(e)}", exc_info=True)
        raise
```

### Step 5: Check CORS Configuration

**File**: `PolicyRadar-backend/app/main.py` (or wherever CORS is configured)

**Verify CORS is set up**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Check**:
- Is CORS middleware configured?
- Are frontend origins allowed?
- Are preflight requests handled?

### Step 6: Check Backend Server Logs

**When testing save endpoint**, check backend console for:
- Request received logs
- API key verification logs
- Database operation logs
- Error logs

**Run backend with verbose logging**:
```bash
cd PolicyRadar-backend
source venv/bin/activate
uvicorn app.main:app --reload --log-level debug
```

---

## 🧪 Testing Checklist

- [ ] Test save endpoint with curl
- [ ] Verify API key matches `.env` file
- [ ] Check database connection
- [ ] Verify route is registered
- [ ] Check CORS configuration
- [ ] Add request logging
- [ ] Test with backend logs visible
- [ ] Verify response format matches OpenAPI spec

---

## 🔧 Common Issues

### Issue 1: API Key Mismatch

**Symptoms**:
- 401 Unauthorized errors
- "Invalid API key" responses

**Fix**:
- Verify `API_KEY` in backend `.env` matches `NEXT_PUBLIC_API_KEY` in frontend `.env.local`
- Restart backend after changing `.env`
- Check API key header name (`X-API-Key`)

### Issue 2: Database Connection Error

**Symptoms**:
- 500 Internal Server Error
- Database connection errors in logs

**Fix**:
- Verify `DATABASE_URL` in `.env`
- Check database is running
- Verify database schema is migrated

### Issue 3: Policy Not Found

**Symptoms**:
- 404 Not Found
- "Policy not found" error

**Fix**:
- Verify policy exists in database
- Check policy ID is correct
- Run database seed if needed

### Issue 4: CORS Error

**Symptoms**:
- Browser CORS errors in console
- Preflight request failures

**Fix**:
- Verify CORS middleware is configured
- Check allowed origins include frontend URL
- Verify allowed methods include POST

---

## ✅ Verification Checklist

- [ ] Backend server running on port 8000
- [ ] Save endpoint responds to curl requests
- [ ] API key verification works
- [ ] Database connection works
- [ ] CORS configured correctly
- [ ] Request logging enabled
- [ ] Error handling works
- [ ] Response format matches OpenAPI spec

---

## 🚀 After Verification

1. **Document findings**: Note any issues found
2. **Fix issues**: Resolve any backend problems
3. **Test endpoint**: Verify curl request works
4. **Update Frontend Agent**: Share results with Frontend Agent
5. **Commit and push**:
   ```bash
   git add .
   git commit -m "fix: add logging and verify save endpoint"
   git push origin main
   ```

---

## 📚 Reference Documents

- **API Contract**: `/contracts/openapi.yml`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**Verify backend API is working correctly and add logging to help debug!**

**Test endpoint directly with curl to isolate backend issues!** 🧪✅

