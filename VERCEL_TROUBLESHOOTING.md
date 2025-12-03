# Vercel Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: MongoDB Connection Fails on Vercel

**Error Messages:**
- "MongoServerError: bad auth : Authentication failed"
- "Cannot connect to database"
- "ECONNREFUSED"

**Root Causes & Solutions:**

1. **Wrong MongoDB Credentials**
   ```
   ❌ WRONG: mongodb+srv://user:pass@cluster.mongodb.net/?...
   ✅ RIGHT: mongodb+srv://username:password@cluster0.oumvnqj.mongodb.net/posts-db?retryWrites=true&w=majority
   ```
   - Verify username/password match MongoDB Atlas
   - Check database name is included
   - Special characters in password must be URL-encoded

2. **IP Whitelist Not Configured**
   - Go to MongoDB Atlas → Network Access
   - Add IP: 0.0.0.0/0 (allows all IPs)
   - Or add specific Vercel IPs (less secure)

3. **Environment Variable Not Set**
   - In Vercel: Settings → Environment Variables
   - Name: `MONGODB_URI`
   - Value: Full connection string
   - Redeploy after adding

**Fix Checklist:**
- [ ] Test connection string locally in `.env` first
- [ ] Username/password are correct in MongoDB Atlas
- [ ] IP 0.0.0.0/0 is whitelisted in Network Access
- [ ] MONGODB_URI is set in Vercel environment variables
- [ ] Clicked "Save" after adding environment variable
- [ ] Redeployed after environment change

### Issue 2: Build Fails on Vercel

**Error: "Failed to compile"**

**Solutions:**
1. Check for TypeScript errors:
   ```bash
   npm run build
   # Should see "✓ Compiled successfully"
   ```

2. Verify all imports are correct:
   - No circular imports
   - All modules are installed
   - Check `npm install` locally first

3. Check Node.js version:
   - Vercel defaults to Node 18+
   - Application requires Node 18+

### Issue 3: API Returns 500 Error

**Check these in order:**

1. **View Function Logs**
   - Vercel Dashboard → Deployments → Select deployment
   - Click "Functions" tab
   - Find `/api/posts` in list
   - Check last 50 logs

2. **Verify MongoDB Connection**
   ```javascript
   // Test in api/posts/route.ts
   console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
   console.log("Attempting to connect...");
   await connectDB();
   console.log("Connected successfully");
   ```

3. **Check Form Data Parsing**
   - Test with curl:
   ```bash
   curl -X POST http://localhost:3000/api/posts \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","content":"Test","author":"Test"}'
   ```

4. **Database Permissions**
   - User has permissions for database
   - User is not locked out (check Atlas)

### Issue 4: Images Not Persisting

**This is expected behavior!**

Vercel's filesystem is ephemeral (temporary). Files written to disk are deleted when the function ends.

**Solution: Use Cloud Storage**

Choose one:

#### Option A: Vercel Blob Storage (Recommended)
```bash
npm install @vercel/blob
```

Update route.ts:
```typescript
import { put } from '@vercel/blob';

if (imageFile && imageFile.size > 0) {
  const buffer = await imageFile.arrayBuffer();
  const blob = await put(
    `${Date.now()}-${imageFile.name}`,
    buffer,
    { access: 'public' }
  );
  imageUrl = blob.url;
}
```

#### Option B: Cloudinary
```bash
npm install next-cloudinary
```

#### Option C: AWS S3
```bash
npm install aws-sdk
```

### Issue 5: Page Shows 404

**Check:**
1. URL is correct: `https://your-project.vercel.app`
2. Deployment was successful (green checkmark on Vercel)
3. Clear browser cache
4. Check Vercel logs for errors

### Issue 6: Very Slow First Load

**This is normal!** Cold starts on serverless functions take 1-2 seconds.

**Improvements:**
1. Upgrade Vercel Pro plan for faster execution
2. Use Vercel Edge Functions (faster)
3. Optimize database queries
4. Add caching headers

### Issue 7: POST Request Fails, GET Works

**Problem:** POST is likely hitting form parsing issue

**Solution:** Ensure correct header:
```javascript
// For JSON
headers: { "Content-Type": "application/json" }

// For FormData with image
headers: {} // Browser sets automatically
```

---

## Environment Variable Checklist

Create a checklist before each deploy:

```
[ ] MONGODB_URI is set in Vercel dashboard
[ ] MONGODB_URI has correct username
[ ] MONGODB_URI has correct password
[ ] MONGODB_URI includes database name (posts-db)
[ ] Password is URL-encoded (if special chars)
[ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
[ ] Redeployed after setting environment variable
```

---

## Vercel Dashboard Navigation

### To view logs:
1. Vercel Dashboard → Select Project
2. Deployments tab → Select latest deployment
3. Functions → /api/posts
4. View logs (last 50)

### To add environment variables:
1. Vercel Dashboard → Select Project
2. Settings → Environment Variables
3. Add: Name = `MONGODB_URI`, Value = `mongodb+srv://...`
4. Redeploy

### To redeploy:
1. Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## Testing Endpoints with curl

### Create post (JSON):
```bash
curl -X POST https://your-project.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test",
    "author": "Test Author"
  }'
```

### Create post (Form Data with Image):
```bash
curl -X POST https://your-project.vercel.app/api/posts \
  -F "title=Test Post" \
  -F "content=This is a test" \
  -F "author=Test Author" \
  -F "image=@/path/to/image.jpg"
```

### Get all posts:
```bash
curl https://your-project.vercel.app/api/posts
```

### Get single post:
```bash
curl https://your-project.vercel.app/api/posts/[POST_ID]
```

### Delete post:
```bash
curl -X DELETE https://your-project.vercel.app/api/posts/[POST_ID]
```

---

## Performance Monitoring

### Monitor in Vercel:
1. Dashboard → Analytics
2. Check: Requests, Edge Network, Compute Time
3. Look for slow endpoints or high error rates

### Monitor in Browser:
1. Open DevTools (F12)
2. Network tab
3. Make requests and observe timing
4. Check for:
   - API latency
   - Response sizes
   - Error responses

---

## Database Monitoring

### Check MongoDB Atlas:
1. https://cloud.mongodb.com
2. Go to Cluster → Connect → Compass
3. Monitor:
   - Connection pool status
   - Query performance
   - Database size

### Test Connection Locally:
```bash
# First, create .env with MongoDB URI
# Then start dev server
npm run dev

# Open browser to http://localhost:3000
# Open DevTools console
# Look for any MongoDB errors
```

---

## Git & Deployment Workflow

### To deploy changes:
```bash
# 1. Make changes locally
git add .
git commit -m "Your message"
git push origin main

# 2. Vercel automatically deploys
# (if GitHub is connected)

# 3. Check deployment status
# Dashboard → Deployments
```

### To rollback:
1. Vercel Dashboard → Deployments
2. Click "..." on previous working deployment
3. Click "Promote to Production"

---

## Advanced: Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Configure DNS records:
   - CNAME: [your-project].vercel.app
   - Or: A record to Vercel IP

---

## Getting Help

### Official Resources:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- TanStack Query: https://tanstack.com/query/latest

### Debug Steps:
1. Check Vercel function logs
2. Run `npm run build` locally
3. Test in development: `npm run dev`
4. Check browser console for errors
5. Review environment variables are set
6. Verify MongoDB credentials are correct

---

## Summary Checklist for Going Live

- [ ] Code pushed to GitHub
- [ ] Connected to Vercel
- [ ] MONGODB_URI environment variable set
- [ ] Build successful on Vercel
- [ ] Home page loads without errors
- [ ] Can create a post
- [ ] Can view posts
- [ ] Can delete a post
- [ ] MongoDB Atlas IP is whitelisted
- [ ] Database has test data
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

Good luck with your deployment! 🚀
