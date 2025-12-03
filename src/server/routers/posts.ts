import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import Post from '@/lib/models/Post';
import { router, publicProcedure } from '@/server/trpc';

export const postsRouter = router({
  getAll: publicProcedure.query(async () => {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return posts;
  }),

  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const post = await Post.findById(input);
    return post;
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        author: z.string().min(1),
        imageBase64: z.string().optional(),
        imageName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let imageUrl: string | undefined = undefined;

      if (input.imageBase64) {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const ext = input.imageName ? path.extname(input.imageName) : '.bin';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
        const dest = path.join(uploadsDir, fileName);
        const buffer = Buffer.from(input.imageBase64, 'base64');
        fs.writeFileSync(dest, buffer);
        imageUrl = `/uploads/${fileName}`;
      }

      const post = await Post.create({
        title: input.title,
        content: input.content,
        author: input.author,
        ...(imageUrl ? { imageUrl } : {}),
      });

      return post;
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), title: z.string().optional(), content: z.string().optional(), author: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const post = await Post.findByIdAndUpdate(id, updates, { new: true });
      return post;
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    await Post.findByIdAndDelete(input);
    return { id: input };
  }),
});
