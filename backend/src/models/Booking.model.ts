import { Schema, model, Document, Types } from 'mongoose';

export interface IBookingDocument extends Document {
  bookingRef: string;
  user: Types.ObjectId;
  tour: Types.ObjectId;
  travelDate: { startDate: Date; endDate: Date };
  travelers: { adults: number; children: number; infants: number };
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  pricing: {
    pricePerPerson: number;
    totalTravelers: number;
    subtotal: number;
    discount: number;
    tax: number;
    totalAmount: number;
    currency: string;
  };
  status: string;
  payment?: Types.ObjectId;
  adminNotes?: string;
  cancelledAt?: Date;
  cancelReason?: string;
}

const bookingSchema = new Schema<IBookingDocument>(
  {
    bookingRef: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
    travelDate: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    travelers: {
      adults: { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
    },
    contactInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String },
    },
    pricing: {
      pricePerPerson: { type: Number, required: true },
      totalTravelers: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      currency: { type: String, default: 'MMK' },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded'],
      default: 'pending',
    },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    adminNotes: { type: String },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ tour: 1, 'travelDate.startDate': 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export const Booking = model<IBookingDocument>('Booking', bookingSchema);
