import mongoose, { Document, Schema } from 'mongoose';

export interface BlogPostDocument extends Document {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  slug: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  publishedAt?: Date;
  views: number;
}

const blogPostSchema = new Schema<BlogPostDocument>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  featuredImage: { type: String, required: true },
  category: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 }
}, { timestamps: true });

export const BlogPostModel = mongoose.model<BlogPostDocument>('BlogPost', blogPostSchema);
