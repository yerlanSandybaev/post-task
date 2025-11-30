import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    author: {
      type: String,
      required: [true, "Please provide an author name"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
