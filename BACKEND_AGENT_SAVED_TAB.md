# Backend Agent - Saved Policies Tab Verification

**Copy and paste this entire prompt to the Backend Agent**

---

You are the Backend Agent for Policy Radar. The Frontend Agent is implementing a visible Saved Policies Tab. You need to **verify** the backend API endpoint is working correctly for this feature.

## 🎯 Current Status

**Status**: 🟢 **LIKELY WORKING** - Needs verification  
**Endpoint**: `GET /api/saved`  
**Purpose**: Return saved policies grouped by effective window

---

## 🔴 CRITICAL TASK: Verify Saved Policies Endpoint

**Status**: 🟢 **VERIFICATION NEEDED**  
**Time**: ~15 minutes  
**Impact**: Saved tab functionality depends on this endpoint

### Problem

Frontend needs `GET /api/saved` to:
- Fetch saved policies grouped by effective window
- Display policies in three groups: `<=90d`, `90-365d`, `>365d`
- Show counts for each group

---

## 🔍 Verification Steps

### Step 1: Test Saved Endpoint Directly

**Run this command**:
```bash
cd PolicyRadar-backend
source venv/bin/activate

# Test saved endpoint
curl -v -X GET http://localhost:8000/api/saved \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d" \
  -H "Content-Type: application/json"
```

**Expected Output**:
```
* Connected to localhost (127.0.0.1) port 8000
> GET /api/saved HTTP/1.1
> Host: localhost:8000
> X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
>
< HTTP/1.1 200 OK
< content-type: application/json
< content-length: ...
<
{
  "<=90d": {
    "window": "<=90d",
    "count": 2,
    "policies": [...]
  },
  "90-365d": {
    "window": "90-365d",
    "count": 1,
    "policies": [...]
  },
  ">365d": {
    "window": ">365d",
    "count": 0,
    "policies": []
  }
}
```

**If error occurs**:
- Check backend server is running
- Verify API key matches request
- Check database connection
- Check for errors in backend logs

### Step 2: Verify Response Schema

**File**: `PolicyRadar-backend/app/api/routes.py`

**Check `get_saved` route** (around line 241):
```python
@router.get("/saved", response_model=SavedResponse)
async def get_saved(
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Get saved policies grouped by effective window."""
    # ... implementation ...
```

**Verify response matches OpenAPI spec**:
- Response has three keys: `<=90d`, `90-365d`, `>365d`
- Each group has: `window`, `count`, `policies`
- Policies array contains `PolicyListItem` objects

**Expected Response Structure** (from `/contracts/openapi.yml`):
```json
{
  "<=90d": {
    "window": "<=90d",
    "count": 2,
    "policies": [
      {
        "id": 1,
        "title": "...",
        "jurisdiction": "EU",
        "policy_type": "Disclosure",
        "status": "Effective",
        "effective_date": "2025-02-15",
        "impact_score": 85,
        "confidence": 0.95,
        "scopes": [1, 2],
        "what_might_change": "...",
        "last_updated_at": "2025-01-15",
        "source_name_official": "..."
      }
    ]
  },
  "90-365d": {
    "window": "90-365d",
    "count": 1,
    "policies": [...]
  },
  ">365d": {
    "window": ">365d",
    "count": 0,
    "policies": []
  }
}
```

### Step 3: Verify Grouping Logic

**File**: `PolicyRadar-backend/app/api/routes.py`

**Check grouping calculation** (around line 268):
```python
for policy in policies:
    if policy.effective_date:
        days_until = (policy.effective_date - today).days
        
        if days_until <= 90:
            less_90d.append(policy)
        elif days_until <= 365:
            between_90_365d.append(policy)
        else:
            greater_365d.append(policy)
    else:
        greater_365d.append(policy)  # No date = long term
```

**Verify**:
- Policies with `effective_date <= today + 90 days` go in `<=90d`
- Policies with `effective_date <= today + 365 days` go in `90-365d`
- Policies with `effective_date > today + 365 days` go in `>365d`
- Policies with no `effective_date` go in `>365d`

### Step 4: Test With Saved Policies

**Test workflow**:
1. **Save a policy** (using POST /api/saved/{id}):
   ```bash
   curl -X POST http://localhost:8000/api/saved/1 \
     -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
   ```

2. **Get saved policies**:
   ```bash
   curl -X GET http://localhost:8000/api/saved \
     -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
   ```

3. **Verify saved policy appears** in correct group

4. **Unsave the policy**:
   ```bash
   curl -X POST http://localhost:8000/api/saved/1 \
     -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
   ```

5. **Verify saved policy removed** from response

### Step 5: Test Empty State

**When no policies are saved**, verify response:
```json
{
  "<=90d": {
    "window": "<=90d",
    "count": 0,
    "policies": []
  },
  "90-365d": {
    "window": "90-365d",
    "count": 0,
    "policies": []
  },
  ">365d": {
    "window": ">365d",
    "count": 0,
    "policies": []
  }
}
```

**Expected**:
- All groups have `count: 0`
- All groups have empty `policies: []`
- No errors or exceptions

### Step 6: Add Request Logging

**File**: `PolicyRadar-backend/app/api/routes.py`

**Add logging** to `get_saved` route:
```python
import logging

logger = logging.getLogger(__name__)

@router.get("/saved", response_model=SavedResponse)
async def get_saved(
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Get saved policies grouped by effective window."""
    logger.info("🟡 GET /api/saved - Request received")
    
    try:
        today = date.today()
        
        # Get all saved policies
        saved_policies = db.query(SavedPolicy).join(Policy).all()
        policy_ids = [sp.policy_id for sp in saved_policies]
        
        logger.info(f"🟡 Found {len(policy_ids)} saved policies")
        
        if not policy_ids:
            logger.info("✅ GET /api/saved - No saved policies, returning empty")
            return SavedResponse(
                less_than_90d=SavedGroup(window="<=90d", count=0, policies=[]),
                between_90_365d=SavedGroup(window="90-365d", count=0, policies=[]),
                greater_than_365d=SavedGroup(window=">365d", count=0, policies=[])
            )
        
        # Get policies
        policies = db.query(Policy).filter(Policy.id.in_(policy_ids)).all()
        
        # Group by effective window
        less_90d = []
        between_90_365d = []
        greater_365d = []
        
        for policy in policies:
            if policy.effective_date:
                days_until = (policy.effective_date - today).days
                
                if days_until <= 90:
                    less_90d.append(policy)
                elif days_until <= 365:
                    between_90_365d.append(policy)
                else:
                    greater_365d.append(policy)
            else:
                greater_365d.append(policy)
        
        result = SavedResponse(
            less_than_90d=SavedGroup(
                window="<=90d",
                count=len(less_90d),
                policies=[PolicyListItem.model_validate(p) for p in less_90d]
            ),
            between_90_365d=SavedGroup(
                window="90-365d",
                count=len(between_90_365d),
                policies=[PolicyListItem.model_validate(p) for p in between_90_365d]
            ),
            greater_than_365d=SavedGroup(
                window=">365d",
                count=len(greater_365d),
                policies=[PolicyListItem.model_validate(p) for p in greater_365d]
            )
        )
        
        logger.info(f"✅ GET /api/saved - Success: <=90d={len(less_90d)}, 90-365d={len(between_90_365d)}, >365d={len(greater_365d)}")
        return result
        
    except Exception as e:
        logger.error(f"❌ GET /api/saved - Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
```

---

## ✅ Verification Checklist

- [ ] Test `GET /api/saved` endpoint with curl
- [ ] Verify API key authentication works
- [ ] Check response structure matches OpenAPI spec
- [ ] Verify grouping logic is correct
- [ ] Test with saved policies (save → get → unsave → get)
- [ ] Test empty state (no saved policies)
- [ ] Add request logging
- [ ] Check for database errors
- [ ] Verify response includes all required fields
- [ ] Check policies are sorted correctly

---

## 🔧 Common Issues

### Issue 1: Empty Response When Policies Exist

**Symptoms**:
- `GET /api/saved` returns all empty groups
- But policies are saved

**Fix**:
- Check `SavedPolicy` table has entries
- Verify `SavedPolicy.policy_id` references exist in `Policy` table
- Check join is working: `db.query(SavedPolicy).join(Policy).all()`

### Issue 2: Wrong Grouping

**Symptoms**:
- Policies appear in wrong groups
- Effective date calculation incorrect

**Fix**:
- Verify `effective_date` is a date object, not string
- Check `days_until` calculation: `(policy.effective_date - today).days`
- Verify date comparison logic

### Issue 3: Missing Fields in Response

**Symptoms**:
- Policies missing fields
- `PolicyListItem` validation fails

**Fix**:
- Check `PolicyListItem.model_validate(p)` doesn't raise errors
- Verify Policy model has all required fields
- Check for None/null values in required fields

---

## 🧪 Testing Steps

### Test 1: Empty State
```bash
# Should return all empty groups
curl -X GET http://localhost:8000/api/saved \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
```

### Test 2: Save and Get
```bash
# Save a policy
curl -X POST http://localhost:8000/api/saved/1 \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"

# Get saved policies
curl -X GET http://localhost:8000/api/saved \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"

# Should show policy in correct group
```

### Test 3: Multiple Policies
```bash
# Save multiple policies
curl -X POST http://localhost:8000/api/saved/1 \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"

curl -X POST http://localhost:8000/api/saved/2 \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"

# Get saved policies - should show both in correct groups
```

---

## 🚀 After Verification

1. **Test endpoint**: Verify curl requests work
2. **Add logging**: Add request/response logging
3. **Fix issues**: Resolve any problems found
4. **Update Frontend Agent**: Share results/status
5. **Commit and push**:
   ```bash
   git add .
   git commit -m "fix: verify and improve saved policies endpoint"
   git push origin main
   ```

---

## 📚 Reference Documents

- **API Contract**: `/contracts/openapi.yml`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**Verify backend API is working correctly for the saved policies tab!**

**Test endpoint directly with curl to ensure it returns correct grouped data!** 🧪✅

