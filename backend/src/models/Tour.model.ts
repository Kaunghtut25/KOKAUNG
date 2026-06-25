import { Schema, model, Document, Types } from 'mongoose';

export interface ITourDocument extends Document {
  title: string;
  slug: string;
  destination: Types.ObjectId;
  description: string;
  shortDescription?: string;
  price: {
    amount: number;
    currency: string;
    discount: number;
    finalPrice: number;
  };
  duration: { days: number; nights: number };
  maxGroupSize: number;
  minGroupSize: number;
  availableDates: {
    startDate: Date;
    endDate: Date;
    slots: number;
    isActive: boolean;
  }[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  category: string;
  difficulty: string;
  tags: string[];
  rating: { average: number; count: number };
  isFeatured: boolean;
  isActive: boolean;
  createdBy?: Types.ObjectId;
}

const tourSchema = new Schema<ITourDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    destination: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, default: 'MMK' },
      discount: { type: Number, default: 0 },
      finalPrice: { type: Number },
    },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    maxGroupSize: { type: Number, default: 20 },
    minGroupSize: { type: Number, default: 1 },
    availableDates: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        slots: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        activities: [{ type: String }],
        meals: [{ type: String }],
        accommodation: { type: String },
      },
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    videoUrl: { type: String },
    category: {
      type: String,
      enum: ['luxury', 'adventure', 'cultural', 'nature', 'beach'],
      default: 'luxury',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'challenging'],
      default: 'easy',
    },
    tags: [{ type: String }],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

tourSchema.pre('save', function (next) {
  const discount = this.price.discount || 0;
  this.price.finalPrice = this.price.amount * (1 - discount / 100);
  next();
});

tourSchema.index({ destination: 1 });
tourSchema.index({ 'price.finalPrice': 1 });
tourSchema.index({ 'availableDates.startDate': 1 });
tourSchema.index({ category: 1, isActive: 1, isFeatured: 1 });
tourSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Tour = model<ITourDocument>('Tour', tourSchema);
