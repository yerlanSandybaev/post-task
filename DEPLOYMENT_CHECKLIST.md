# ✅ Deployment Checklist

Use this checklist to ensure everything is ready for Vercel deployment.

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] Build runs successfully: `npm run build` ✅
- [ ] Dev server starts without errors: `npm run dev`
- [ ] No console errors in browser DevTools
- [ ] Code is committed to git: `git status` shows nothing

### Project Files
- [ ] `next.config.ts` exists and is configured
- [ ] `tsconfig.json` is set up correctly
- [ ] `tailwind.config.ts` is configured
- [ ] `.env.example` created with template
- [ ] `.gitignore` excludes `.env` and `node_modules`

### Database Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 free tier is fine)
- [ ] Database user created with username and password
- [ ] Network Access allows 0.0.0.0/0
- [ ] Connection string obtained and tested locally

### Local Testing
- [ ] Created `.env` file with MONGODB_URI
- [ ] Can start dev server: `npm run dev`
- [ ] Home page loads without errors
- [ ] Can create a new post
- [ ] Can view created post in list
- [ ] Can delete a post
- [ ] Image upload works (optional feature)

### Git Repository
- [ ] Repository created on GitHub
- [ ] All code committed: `git add . && git commit`
- [ ] Repository pushed: `git push`
- [ ] Repository is public (or shared with Vercel)

---

## Deployment Steps Checklist

### Step 1: MongoDB Atlas Configuration
- [ ] Go to https://cloud.mongodb.com
- [ ] Have username and password ready
- [ ] Have full connection string copied
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Step 2: Vercel Setup
- [ ] Vercel account created at https://vercel.com
- [ ] GitHub account connected to Vercel
- [ ] Ready to authorize Vercel to access GitHub

### Step 3: Deployment
- [ ] Go to https://vercel.com/new
- [ ] Selected GitHub repository
- [ ] Added MONGODB_URI environment variable
- [ ] Clicked "Deploy"
- [ ] Waited for build to complete (2-3 minutes)
- [ ] Deployment shows "Ready"

### Step 4: Post-Deployment Verification
- [ ] Deployment URL is accessible
- [ ] Home page loads without errors
- [ ] Can create a new post on production
- [ ] Can view the created post
- [ ] Can delete the post
- [ ] No errors in Vercel function logs

---

## Troubleshooting Checklist

If something doesn't work, verify:

### Build Fails
- [ ] Run `npm run build` locally - does it work?
- [ ] Are all dependencies installed? `npm install`
- [ ] Is Node version >= 18?
- [ ] Check Vercel logs for specific error

### MongoDB Connection Fails
- [ ] Connection string is correct (copy-paste from MongoDB Atlas)
- [ ] Username and password are URL-encoded if they have special characters
- [ ] IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- [ ] Database user exists in MongoDB Atlas "Database Access"
- [ ] Environment variable MONGODB_URI is set in Vercel

### API Returns 500 Error
- [ ] Check Vercel function logs: Dashboard → Functions
- [ ] Can connect to MongoDB locally with same connection string?
- [ ] Try creating a post with curl to test API directly
- [ ] Check browser console for error details

### Images Not Showing
- [ ] This is expected on Vercel (ephemeral filesystem)
- [ ] For production, implement cloud storage (see DEPLOYMENT.md)

---

## Vercel Dashboard Checklist

After successful deployment, verify in Vercel dashboard:

- [ ] Project shows in "Projects" list
- [ ] Latest deployment shows green checkmark (success)
- [ ] Deployment details show "Ready"
- [ ] Deployment URL is accessible
- [ ] MONGODB_URI is set in Settings → Environment Variables
- [ ] Can view function logs without errors
- [ ] Analytics tab shows some traffic (if accessed)

---

## Environment Variables Verification

In Vercel → Settings → Environment Variables:

- [ ] Variable Name: `MONGODB_URI`
- [ ] Variable Value: Full MongoDB connection string
- [ ] Format verified:
  ```
  mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
  ```

### Connection String Breakdown:
- [ ] `USERNAME` = MongoDB user you created
- [ ] `PASSWORD` = MongoDB user password (URL-encoded if special chars)
- [ ] `CLUSTER` = Your cluster name (e.g., cluster0.oumvnqj)
- [ ] `DATABASE` = Your database name (e.g., posts-db)

---

## Testing Deployment

### Test 1: Home Page
- [ ] Open deployment URL
- [ ] Page loads within 2 seconds
- [ ] No 404 or 500 errors
- [ ] "Posts" heading is visible
- [ ] "New Post" button is visible

### Test 2: Create Post (JSON)
```bash
curl -X POST https://YOUR_DEPLOYMENT_URL/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test",
    "author": "Test Author"
  }'
```
- [ ] Returns 201 status
- [ ] Returns created post with _id
- [ ] No error messages

### Test 3: Get All Posts
```bash
curl https://YOUR_DEPLOYMENT_URL/api/posts
```
- [ ] Returns 200 status
- [ ] Returns array of posts
- [ ] Posts include all fields (title, content, author, createdAt, etc.)

### Test 4: UI Testing
- [ ] Open home page
- [ ] Click "New Post" button
- [ ] Form appears
- [ ] Fill in Title, Author, Content
- [ ] Click "Create Post"
- [ ] Post appears in list after 1-2 seconds
- [ ] Post shows correct data
- [ ] Can click delete button
- [ ] Post is removed from list after deletion

### Test 5: Image Upload (Optional)
- [ ] Click "New Post"
- [ ] Fill in form fields
- [ ] Click file input and select an image
- [ ] File name appears next to input
- [ ] Click "Create Post"
- [ ] Post is created successfully

---

## Documentation Checklist

Have you reviewed:
- [ ] `QUICK_START.md` - Quick deployment guide
- [ ] `DEPLOYMENT.md` - Detailed deployment guide
- [ ] `VERCEL_TROUBLESHOOTING.md` - Troubleshooting guide
- [ ] `PROJECT_STATUS.md` - Complete project overview
- [ ] `.env.example` - Environment variable template

---

## Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] `.env` file is in `.gitignore`
- [ ] MongoDB credentials are server-only (not in client code)
- [ ] Environment variables are set in Vercel (not in code)
- [ ] No sensitive data in git history

---

## Performance Checklist

- [ ] First load time is < 3 seconds
- [ ] API responses are < 200ms (after cold start)
- [ ] No console warnings in browser
- [ ] No unnecessary API calls
- [ ] Images load quickly (when implemented with cloud storage)

---

## Final Pre-Launch Checklist

- [ ] All tests passed above ✅
- [ ] No errors in Vercel logs ✅
- [ ] Database contains test data ✅
- [ ] Deployment URL is working ✅
- [ ] Ready to share with users ✅

---

## Post-Launch Checklist

- [ ] Share deployment URL with others
- [ ] Monitor Vercel dashboard for errors
- [ ] Check database periodically for data growth
- [ ] Plan for future features (see PROJECT_STATUS.md)
- [ ] Consider implementing cloud storage for images
- [ ] Set up custom domain (optional)

---

## Need Help?

If you get stuck:

1. **Check logs**
   - Vercel Dashboard → Deployments → Functions → /api/posts
   - Look for error messages

2. **Test locally first**
   - `npm run dev`
   - Verify everything works locally before blaming Vercel

3. **Review documentation**
   - QUICK_START.md - Simple deployment
   - DEPLOYMENT.md - Detailed guide
   - VERCEL_TROUBLESHOOTING.md - Common issues

4. **Verify credentials**
   - MongoDB username/password correct?
   - Connection string copied correctly?
   - IP whitelist set to 0.0.0.0/0?

5. **Ask for help**
   - Vercel: https://vercel.com/support
   - MongoDB: https://support.mongodb.com
   - Next.js: https://github.com/vercel/next.js/discussions

---

## Summary

Your fullstack posts application is complete and ready for production!

✅ Build tested locally
✅ Code committed to GitHub  
✅ MongoDB Atlas configured
✅ Vercel deployment ready
✅ Documentation complete

**Next step:** Follow QUICK_START.md to deploy to Vercel!

---

**Last Updated**: December 2, 2025
**Status**: 🚀 Ready for Production
