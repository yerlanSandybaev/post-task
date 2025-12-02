import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import fs from "fs";
import path from "path";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const contentType = request.headers.get("content-type");
    let title: string;
    let content: string;
    let author: string;
    let imageUrl: string | undefined = undefined;

    if (contentType?.includes("multipart/form-data")) {
      // Parse multipart form data
      const formData = await request.formData();
      title = formData.get("title") as string;
      content = formData.get("content") as string;
      author = formData.get("author") as string;
      const imageFile = formData.get("image") as File | null;

      if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const ext = path.extname(imageFile.name) || ".bin";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
        const dest = path.join(uploadsDir, fileName);

        fs.writeFileSync(dest, Buffer.from(buffer));
        imageUrl = `/uploads/${fileName}`;
      }
    } else {
      // Parse JSON
      const body = await request.json();
      title = body.title;
      content = body.content;
      author = body.author;
    }

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const post = await Post.create({
      title,
      content,
      author,
      ...(imageUrl ? { imageUrl } : {}),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
