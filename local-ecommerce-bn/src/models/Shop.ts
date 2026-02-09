import mongoose, { Document, Schema } from 'mongoose';

export interface ShopDocument extends Document {
  name: string;
  description?: string;
  location: string;
  telephone: string;
  email: string;
  image?: string;
}
//this is the change i did 
const shopSchema = new Schema<ShopDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

export const ShopModel = mongoose.model<ShopDocument>('Shop', shopSchema);

//commented code base
