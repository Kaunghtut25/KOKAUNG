import { Schema, model, Document } from 'mongoose';

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  avatar?: string;
  nationality: string;
  preferredLanguage: 'en' | 'my';
  refreshToken?: string;
  telegramChatId?: string;
}

const userSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
    nationality: { type: String, default: 'Myanmar' },
    preferredLanguage: { type: String, enum: ['en', 'my'], default: 'en' },
    refreshToken: { type: String, select: false },
    telegramChatId: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ phone: 1 });
userSchema.index({ role: 1, isActive: 1 });

export const User = model<IUserDocument>('User', userSchema);
