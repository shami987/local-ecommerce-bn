import mongoose, { Document, Schema } from 'mongoose';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

export const UserModel = mongoose.model<UserDocument>('User', userSchema);