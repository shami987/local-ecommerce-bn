import mongoose, { Document, Schema } from 'mongoose';

export interface PromotionDocument extends Document {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  bannerImage?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  shop: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  isActive: boolean;
  terms?: string;
  owner: mongoose.Types.ObjectId;
}

const promotionSchema = new Schema<PromotionDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  bannerImage: { type: String },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true },
  terms: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const PromotionModel = mongoose.model<PromotionDocument>('Promotion', promotionSchema);
