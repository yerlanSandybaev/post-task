import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: Request): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: false });
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

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

    // parse multipart/form-data with formidable
    const { fields, files } = await parseForm(request as unknown as Request);

    const title = fields.title as string;
    const content = fields.content as string;
    const author = fields.author as string;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined = undefined;

    if (files && (files as any).image) {
      const file = (files as any).image;
      const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
      const originalName = Array.isArray(file) ? file[0].originalFilename : file.originalFilename;

      // ensure uploads folder exists
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const ext = path.extname(originalName || "") || path.extname(filePath) || ".bin";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
      const dest = path.join(uploadsDir, fileName);

      // move temp file to public/uploads
      fs.copyFileSync(filePath, dest);

      imageUrl = `/uploads/${fileName}`;
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
