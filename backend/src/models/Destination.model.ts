import { Schema, model, Document } from 'mongoose';

export interface IDestinationDocument extends Document {
  name: string;
  slug: string;
  country: string;
  region?: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  gallery: string[];
  coordinates?: { lat: number; lng: number };
  isFeatured: boolean;
  isActive: boolean;
  tourCount: number;
}

const destinationSchema = new Schema<IDestinationDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    country: { type: String, default: 'Myanmar' },
    region: { type: String },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tourCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

destinationSchema.index({ country: 1, region: 1 });
destinationSchema.index({ isFeatured: 1, isActive: 1 });
destinationSchema.index({ name: 'text', description: 'text' });

export const Destination = model<IDestinationDocument>('Destination', destinationSchema);
