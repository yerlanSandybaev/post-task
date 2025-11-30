# Posts Application - Full Stack with Next.js, Shadcn UI, and MongoDB

A modern full-stack web application built with Next.js, React, Shadcn UI, TanStack Query, and MongoDB/Mongoose.

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query (React Query) with devtools
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ORM
- **API Client**: Axios

## 📋 Features

- ✅ View all posts in a beautiful UI
- ✅ Create new posts with title, content, and author
- ✅ Delete posts
- ✅ Real-time UI updates with TanStack Query
- ✅ Responsive design with Shadcn UI components
- ✅ Loading states and error handling

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd post-task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB:**
   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/posts-db`)
   - Update `.env` file with your MongoDB URI:
     ```
     MONGODB_URI="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/posts-db?retryWrites=true&w=majority"
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts          # GET all posts, POST new post
│   │       └── [id]/route.ts     # GET, PUT, DELETE individual post
│   ├── layout.tsx                # Root layout with QueryProvider
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── providers/
│   │   └── QueryProvider.tsx     # TanStack Query provider
│   └── PostsList.tsx             # Main posts component
├── hooks/
│   └── usePosts.ts               # TanStack Query hooks
└── lib/
    ├── db.ts                     # MongoDB connection
    └── models/
        └── Post.ts               # Mongoose Post model
```

## 🔄 API Endpoints

### Get all posts
```bash
GET /api/posts
```

### Create a post
```bash
POST /api/posts
Content-Type: application/json

{
  "title": "Post Title",
  "content": "Post content here",
  "author": "Author name"
}
```

### Get a single post
```bash
GET /api/posts/:id
```

### Update a post
```bash
PUT /api/posts/:id
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content",
  "author": "Updated author"
}
```

### Delete a post
```bash
DELETE /api/posts/:id
```

## 🎨 UI Components Used

- **Button** - Interactive buttons with loading states
- **Card** - Post containers with hover effects
- **Input** - Form input fields

All components are from Shadcn UI with Tailwind CSS styling.

## 🔍 MongoDB Compass

To visualize your MongoDB data:

1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Use your MongoDB URI to connect
3. Browse the `posts-db` database and `posts` collection
4. View, edit, or delete documents directly

## 📝 Database Model

**Post Schema:**
```typescript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  author: String (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🚀 Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📦 Dependencies

**Main Dependencies:**
- next@16.0.6
- react@19.2.0
- mongoose@9.0.0
- @tanstack/react-query@5.90.11
- axios@1.13.2
- lucide-react@0.555.0

**Dev Dependencies:**
- typescript@5
- tailwindcss@4
- eslint@9

## 🎯 Notes

- The app uses TanStack Query for automatic caching and synchronization
- React Query DevTools are available in development (toggle with button in sidebar)
- All API routes automatically handle database connections via Mongoose
- MongoDB connection is cached in memory to optimize performance

## 📞 Support

For issues with MongoDB setup, visit https://docs.mongodb.com/compass/
For Next.js documentation, visit https://nextjs.org/docs
