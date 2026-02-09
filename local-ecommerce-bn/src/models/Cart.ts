import mongoose, { Document, Schema } from 'mongoose';

export interface CartItemDocument {
  product: mongoose.Types.ObjectId;
  quantity: number;
}
//changed files in comment
export interface CartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItemDocument[];
}

const cartItemSchema = new Schema<CartItemDocument>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const cartSchema = new Schema<CartDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

export const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);
