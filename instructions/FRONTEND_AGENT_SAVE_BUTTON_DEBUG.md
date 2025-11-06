# Frontend Agent - Save Button Debug & Fix

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. The save button is not working - **NO console response when clicked**.

## 🚨 Critical Issue

**Status**: 🔴 **NOT WORKING** - No response when save button clicked  
**User Report**: "When I click the save button there is no console response or anything"

**Symptoms**:
- Save button click produces no console logs
- No API calls visible in Network tab
- No error messages
- No success feedback
- Silent failure

---

## 🔴 CRITICAL TASK: Debug and Fix Save Button

**Status**: 🔴 **SILENT FAILURE**  
**Time**: ~30 minutes  
**Impact**: Save functionality completely broken

### Problem

The save button click handler doesn't produce any output - no console logs, no API calls, no errors. This suggests:

1. **Click handler not firing** - Button onClick not wired correctly
2. **Error silently caught** - Errors being caught but not logged
3. **API call failing silently** - Network errors not being handled
4. **React Query errors not displayed** - Mutation errors not logged

---

## 🔍 Investigation Steps

### Step 1: Add Console Logging to Click Handler

**File**: `policy-radar-frontend/components/policy-drawer.tsx`

**Update `handleSave` function** (around line 84):
```tsx
const handleSave = () => {
  console.log('🔵 Save button clicked', { policyId: policy.id })
  
  if (!policy?.id) {
    console.error('❌ No policy ID found')
    return
  }
  
  try {
    console.log('🟢 Calling toggleSaved.mutate', { policyId: policy.id })
    toggleSaved.mutate(policy.id, {
      onSuccess: (data) => {
        console.log('✅ Save successful', { data, policyId: policy.id })
      },
      onError: (error) => {
        console.error('❌ Save failed', { error, policyId: policy.id })
      },
    })
  } catch (error) {
    console.error('❌ Save handler error', { error, policyId: policy.id })
  }
}
```

### Step 2: Add Error Logging to React Query Mutation

**File**: `policy-radar-frontend/lib/queries/saved.ts`

**Update `useToggleSaved` hook** (around line 32):
```tsx
export function useToggleSaved() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (policyId: number) => {
      console.log('🟡 useToggleSaved mutationFn called', { policyId })
      return toggleSaved(policyId)
    },
    onMutate: async (policyId: number) => {
      console.log('🟡 useToggleSaved onMutate', { policyId })
      // ... existing code ...
    },
    onError: (error, policyId, context) => {
      console.error('❌ useToggleSaved onError', { error, policyId, context })
      // Rollback on error
      if (context?.previousSaved) {
        queryClient.setQueryData(savedKeys.list(), context.previousSaved)
      }
      if (context?.previousPolicies) {
        queryClient.setQueryData(
          policyKeys.lists(),
          context.previousPolicies
        )
      }
    },
    onSuccess: (data, policyId) => {
      console.log('✅ useToggleSaved onSuccess', { data, policyId })
    },
    onSettled: () => {
      console.log('🟡 useToggleSaved onSettled')
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: savedKeys.list() })
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
    },
  })
}
```

### Step 3: Add Error Logging to API Client

**File**: `policy-radar-frontend/lib/services/saved.ts`

**Update `toggleSaved` function** (around line 92):
```tsx
export async function toggleSaved(
  policyId: number
): Promise<ToggleSavedResponse> {
  console.log('🟡 toggleSaved called', { policyId, USE_FIXTURES })
  
  if (USE_FIXTURES) {
    const wasSaved = mockSavedIds.has(policyId)
    
    if (wasSaved) {
      mockSavedIds.delete(policyId)
    } else {
      mockSavedIds.add(policyId)
    }

    const result = {
      saved: !wasSaved,
    }
    console.log('✅ toggleSaved (fixtures) result', { result, policyId })
    return result
  }

  console.log('🟡 toggleSaved calling API', { policyId })
  try {
    const result = await apiClient.post<ToggleSavedResponse>(`/saved/${policyId}`)
    console.log('✅ toggleSaved API success', { result, policyId })
    return result
  } catch (error) {
    console.error('❌ toggleSaved API error', { error, policyId })
    throw error
  }
}
```

### Step 4: Add Error Logging to API Client Base

**File**: `policy-radar-frontend/lib/api-client.ts`

**Update `request` method** (around line 27):
```tsx
private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${this.baseUrl}${endpoint}`
  console.log('🟡 API request', { method: options.method || 'GET', url, baseUrl: this.baseUrl })
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (this.apiKey) {
    headers['X-API-Key'] = this.apiKey
    console.log('🟡 API key present', { keyLength: this.apiKey.length })
  } else {
    console.warn('⚠️ No API key provided')
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    console.log('🟡 API response', { 
      status: response.status, 
      statusText: response.statusText,
      url 
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Unknown error',
        message: `HTTP ${response.status}: ${response.statusText}`,
      }))
      console.error('❌ API error response', { error, status: response.status, url })
      throw error
    }

    const data = await response.json()
    console.log('✅ API success', { url, dataLength: JSON.stringify(data).length })
    return data
  } catch (error) {
    console.error('❌ API request failed', { error, url, method: options.method || 'GET' })
    throw error
  }
}
```

---

## 🧪 Testing After Changes

### Manual Test Steps:

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Open a policy drawer** (click any policy)
3. **Click save button** (header or bottom)
4. **Check console for logs**:
   - Should see: `🔵 Save button clicked`
   - Should see: `🟢 Calling toggleSaved.mutate`
   - Should see: `🟡 useToggleSaved mutationFn called`
   - Should see: `🟡 toggleSaved called`
   - Should see: `🟡 API request` (if not fixtures)
   - Should see: `✅ Save successful` or `❌ Save failed`

5. **Check Network tab**:
   - Should see: `POST /api/saved/{id}` request
   - Check request headers (X-API-Key present?)
   - Check response (200 OK or error?)

### Expected Console Output:

**If working correctly:**
```
🔵 Save button clicked { policyId: 1 }
🟢 Calling toggleSaved.mutate { policyId: 1 }
🟡 useToggleSaved mutationFn called { policyId: 1 }
🟡 toggleSaved called { policyId: 1, USE_FIXTURES: false }
🟡 toggleSaved calling API { policyId: 1 }
🟡 API request { method: 'POST', url: 'http://localhost:8000/api/saved/1', ... }
🟡 API key present { keyLength: 64 }
🟡 API response { status: 200, statusText: 'OK', url: '...' }
✅ API success { url: '...', dataLength: ... }
✅ toggleSaved API success { result: { saved: true }, policyId: 1 }
✅ useToggleSaved onSuccess { data: { saved: true }, policyId: 1 }
✅ Save successful { data: { saved: true }, policyId: 1 }
```

**If error occurs:**
```
❌ Save failed { error: ..., policyId: 1 }
```

---

## 🔧 Common Issues to Check

### Issue 1: Button onClick Not Firing

**Check**:
- Is button disabled? (`disabled={toggleSaved.isPending}`)
- Is onClick handler attached? (`onClick={handleSave}`)
- Are there any JavaScript errors blocking execution?

**Fix**:
- Remove `disabled` temporarily to test
- Verify onClick is in button JSX
- Check console for JavaScript errors

### Issue 2: API Key Missing

**Check**:
- Is `NEXT_PUBLIC_API_KEY` set in `.env.local`?
- Is API key being read correctly?
- Is API key in request headers?

**Fix**:
- Verify `.env.local` has `NEXT_PUBLIC_API_KEY=...`
- Restart dev server after changing `.env.local`
- Check console for "No API key provided" warning

### Issue 3: CORS Error

**Check**:
- Are CORS headers set on backend?
- Is API URL correct?
- Are preflight requests failing?

**Fix**:
- Check Network tab for CORS errors
- Verify backend CORS configuration
- Check API URL in `.env.local`

### Issue 4: Network Error

**Check**:
- Is backend server running?
- Is API URL reachable?
- Are network requests being blocked?

**Fix**:
- Verify backend on `http://localhost:8000`
- Test API endpoint directly with curl
- Check browser network tab for errors

---

## ✅ Checklist

- [ ] Add console logging to `handleSave` function
- [ ] Add console logging to `useToggleSaved` hook
- [ ] Add console logging to `toggleSaved` service
- [ ] Add console logging to `apiClient.request` method
- [ ] Add error callbacks to `toggleSaved.mutate` call
- [ ] Test in browser console
- [ ] Check Network tab for API calls
- [ ] Verify API key is set
- [ ] Verify backend is running
- [ ] Fix any issues found
- [ ] Remove debug logs after fixing (or keep minimal ones)

---

## 🚀 After Fixing

1. **Test manually**: Click save button and check console
2. **Verify API calls**: Check Network tab for POST requests
3. **Check for errors**: Look for any red errors in console
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "fix: add debugging and fix save button functionality"
   git push origin main
   ```

---

## 📚 Reference Documents

- **API Contract**: `/contracts/openapi.yml`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**This is CRITICAL - Fix immediately and add comprehensive logging to identify the issue!**

**Test in browser console to see what's happening!** 🧪✅

