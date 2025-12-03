# Deployment Guide - Vercel Deployment

## Project Overview

This is a fullstack Next.js application with:
- **Frontend**: React 19.2.0 with Shadcn UI components
- **Backend**: Next.js API routes
- **Database**: MongoDB Atlas with Mongoose ORM
- **State Management**: TanStack Query v5
- **File Uploads**: Image upload support with local storage

## Vercel Deployment Steps

### 1. Prerequisites
- MongoDB Atlas account (https://cloud.mongodb.com)
- Vercel account (https://vercel.com)
- GitHub repository (already set up)

### 2. MongoDB Atlas Setup

**Create MongoDB Database:**
1. Go to https://cloud.mongodb.com
2. Create a new cluster (or use existing one)
3. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Username: `your_username`
   - Password: Generate a strong password
   - Click "Add User"
4. Whitelist IP Address:
   - Click "Network Access" → "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0) for development
   - For production, use your Vercel IP ranges
5. Get Connection String:
   - Click "Cluster" → "Connect" → "Drivers"
   - Select "Node.js" 
   - Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`

### 3. Environment Variables for Vercel

**In your Vercel project:**
1. Go to Settings → Environment Variables
2. Add the following:

```
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Important:**
- Replace `<your_username>` with your MongoDB Atlas user
- Replace `<your_password>` with your MongoDB Atlas password
- Replace `<your_cluster>` with your cluster name (e.g., cluster0.oumvnqj)
- Replace `<database>` with your database name (e.g., posts-db)
- Make sure the password is URL-encoded if it contains special characters

### 4. Image Upload Storage Considerations

**Current Implementation:** 
- Images are saved to `public/uploads/` directory
- This works locally and on Vercel, but files will be lost on redeploys
- Vercel's filesystem is ephemeral - use only for development

**For Production:**
To persist images across deployments, use cloud storage:

#### Option A: Use Vercel Blob Storage (Recommended)
```bash
npm install @vercel/blob
```

Update `/src/app/api/posts/route.ts`:
```typescript
import { put } from '@vercel/blob';

// In POST handler, replace file saving with:
if (imageFile && imageFile.size > 0) {
  const buffer = await imageFile.arrayBuffer();
  const blob = await put(imageFile.name, buffer, { access: 'public' });
  imageUrl = blob.url;
}
```

#### Option B: Use AWS S3
```bash
npm install aws-sdk
```

#### Option C: Use Cloudinary
```bash
npm install next-cloudinary
```

### 5. Deploy to Vercel

**Method 1: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Method 2: Connect GitHub Repository**
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"
5. Configure project (Next.js is auto-detected)
6. Add environment variables (MONGODB_URI)
7. Click "Deploy"

### 6. Troubleshooting

**Error: "MongoServerError: bad auth"**
- Verify MongoDB credentials in Vercel environment variables
- Check IP whitelist includes 0.0.0.0/0 or Vercel's IP ranges
- Ensure database user exists and password is correct

**Error: "Cannot find module 'mongoose'"**
- Run `npm install` locally first
- Vercel should automatically install dependencies

**Images not persisting after deploy**
- This is expected behavior - Vercel filesystem is ephemeral
- Implement cloud storage solution (see above options)

**API calls returning 500 errors**
- Check Vercel function logs: Project Settings → Functions
- Verify MONGODB_URI is set correctly
- Test connection string locally first

### 7. Verify Deployment

1. Open your Vercel deployment URL
2. Should see the Posts application
3. Try creating a post:
   - Click "New Post"
   - Fill in Title, Author, Content
   - Click "Create Post"
4. Verify post appears in the list
5. Test delete functionality

### 8. Database Connection Pooling

Mongoose uses connection pooling by default, which works well with Vercel's serverless functions. Configuration in `src/lib/db.ts`:
- Automatic caching of database connection
- Reuses connection across function invocations
- Optimized for Vercel's function lifecycle

## Project Structure

```
src/
├── app/
│   ├── api/posts/          # REST API endpoints
│   │   ├── route.ts        # GET all, POST new
│   │   └── [id]/route.ts   # GET one, PUT, DELETE
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/
│   ├── PostsList.tsx       # Main UI component
│   ├── providers/
│   │   └── QueryProvider.tsx # TanStack Query provider
│   └── ui/                 # Shadcn UI components
├── hooks/
│   └── usePosts.ts        # React Query hooks
└── lib/
    ├── db.ts              # MongoDB connection
    └── models/Post.ts     # Mongoose schema
```

## API Documentation

### GET /api/posts
Fetch all posts sorted by creation date (newest first)

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Post Title",
    "content": "Post content...",
    "author": "Author Name",
    "imageUrl": "/uploads/filename.jpg",
    "createdAt": "2024-12-02T...",
    "updatedAt": "2024-12-02T..."
  }
]
```

### POST /api/posts
Create a new post with optional image

**Form Data:**
- `title` (string, required)
- `content` (string, required)
- `author` (string, required)
- `image` (file, optional)

### GET /api/posts/[id]
Fetch a single post by ID

### PUT /api/posts/[id]
Update a post

### DELETE /api/posts/[id]
Delete a post

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| MONGODB_URI | Yes | MongoDB Atlas connection string |

## Features

✅ Create, read, update, delete posts
✅ Image upload support
✅ Real-time data synchronization with TanStack Query
✅ Responsive UI with Shadcn components
✅ TypeScript throughout
✅ Tailwind CSS styling
✅ React Query DevTools for debugging

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with MongoDB credentials
cp .env.example .env

# Edit .env with your MongoDB URI
# Then start dev server
npm run dev

# Open http://localhost:3000
```

## Performance Optimizations

- Automatic static page generation for home page
- Image optimization with Next.js
- React Compiler enabled for better performance
- Connection pooling for database
- Query caching with 5-minute stale time

## Notes for Vercel

1. **Build Time**: First build ~30-60 seconds, subsequent ~10-15 seconds
2. **Cold Starts**: Serverless functions may have slight delay on first request
3. **Logs**: Monitor in Vercel dashboard under Functions
4. **Scaling**: Automatically scales with traffic

---

For questions or issues, check the Vercel documentation: https://vercel.com/docs
