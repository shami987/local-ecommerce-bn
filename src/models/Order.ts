import mongoose, { Document, Schema } from 'mongoose';

export interface OrderDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress?: string;
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  shippingAddress: { type: String }
}, { timestamps: true });

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
