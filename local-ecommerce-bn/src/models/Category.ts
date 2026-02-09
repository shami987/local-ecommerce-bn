import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description?: string;
  image?: string;
}

const categorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String }
}, { timestamps: true });

export const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema);
