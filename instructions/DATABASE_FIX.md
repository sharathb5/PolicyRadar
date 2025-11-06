# Quick Database Fix

Based on your terminal errors, here's what happened and how to fix it:

## What Went Wrong

1. You tried to run shell commands (`echo`, `source`) **inside** `psql` - those only work in your terminal
2. You tried to run `sql` as a command - that's not a thing
3. The database creation failed, but the user was created successfully

## Current Status

✅ User `policyradar_user` exists (already created)  
❌ Database `policyradar` does NOT exist (needs to be created)

## Quick Fix

### Option 1: Create Database Now (Simplest)

```bash
# In your terminal (NOT inside psql), run:
psql postgres -c "CREATE DATABASE policyradar;"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE policyradar TO policyradar_user;"
```

That's it! Database is created.

### Option 2: Use psql Interactive Mode

```bash
# Connect to psql
psql postgres

# Inside psql (you'll see postgres=#), type ONLY this command:
CREATE DATABASE policyradar;

# Press Enter. Should see: CREATE DATABASE

# Then run:
GRANT ALL PRIVILEGES ON DATABASE policyradar TO policyradar_user;

# Press Enter. Should see: GRANT

# Exit:
\q
```

### Option 3: Verify What You Have

```bash
# Check if database exists
psql -l | grep policyradar

# Check if user exists
psql postgres -c "\du" | grep policyradar_user
```

## Common Mistakes to Avoid

❌ **DON'T** run shell commands (`echo`, `source`) inside psql  
❌ **DON'T** type `sql` as a command  
❌ **DON'T** copy-paste entire code blocks with comments inside psql  
✅ **DO** run SQL commands one at a time inside psql  
✅ **DO** run shell commands in your terminal (before entering psql)

## Test It Works

```bash
# Try connecting to the database
psql policyradar

# If it connects successfully, you're good! Exit with:
\q
```

If you can connect, proceed to Step 2 in the setup guide!

