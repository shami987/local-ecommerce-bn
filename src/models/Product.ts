import mongoose, { Document, Schema } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: mongoose.Types.ObjectId;
  image?: string;
  stock?: number;
  seller: string;
  location: string;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String },
  stock: { type: Number, default: 0 },
  seller: { type: String, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
