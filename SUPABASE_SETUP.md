# Supabase Configuration - Ready to Use

## Your Supabase Credentials

**Project URL:** `https://lkxqkytxijlxlxsuystm.supabase.co`

**Database Host:** `db.lkxqkytxijlxlxsuystm.supabase.co`

**Database Password:** `fullstack2025`

### API Keys

**Anon/Public Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreHFreXR4aWpseGx4c3V5c3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTM0OTQsImV4cCI6MjA3ODg4OTQ5NH0.Lm4QknVN0P2FGI94kMj2B4_cru1HFDD_k1IeqhmAXcc
```

**Service Role Key (SECRET - Keep Safe):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreHFreXR4aWpseGx4c3V5c3RtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMzQ5NCwiZXhwIjoyMDc4ODg5NDk0fQ.tlLUvyBjY3u1guN2-zzwz_ZK-qcD2pY8bRvMZBbxpbw
```

### Connection Strings

**Direct Connection:**
```
postgresql://postgres:fullstack2025@db.lkxqkytxijlxlxsuystm.supabase.co:5432/postgres
```

**Session Pooler:**
```
postgresql://postgres.lkxqkytxijlxlxsuystm:fullstack2025@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

---

## Railway Environment Variables

Use these values in Railway backend service:

```
PORT=3001
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=https://lkxqkytxijlxlxsuystm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreHFreXR4aWpseGx4c3V5c3RtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxMzQ5NCwiZXhwIjoyMDc4ODg5NDk0fQ.tlLUvyBjY3u1guN2-zzwz_ZK-qcD2pY8bRvMZBbxpbw

# Database Connection
DB_HOST=db.lkxqkytxijlxlxsuystm.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=fullstack2025
DB_SSL=true

# Also set these for compatibility
SUPABASE_DB_NAME=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=fullstack2025
SUPABASE_SSL=true
```

---

## Tables Status

All tables are created and marked as "Unrestricted":
- ✅ audit_logs
- ✅ companies
- ✅ company_registration_requests
- ✅ departments
- ✅ employee_managers
- ✅ employee_project_summaries
- ✅ employee_roles
- ✅ employee_teams
- ✅ employees
- ✅ teams
- ✅ trainer_settings

---

## Next Steps

1. ✅ Database is ready
2. ⏭️ Deploy backend to Railway (use credentials above)
3. ⏭️ Deploy frontend to Vercel
4. ⏭️ Test connections

