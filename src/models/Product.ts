import mongoose, { Document, Schema } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: mongoose.Types.ObjectId;
  shop?: mongoose.Types.ObjectId;
  image?: string;
  stock?: number;
  seller: string;
  location: string;
  owner: mongoose.Types.ObjectId;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  image: { type: String },
  stock: { type: Number, default: 0 },
  seller: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
