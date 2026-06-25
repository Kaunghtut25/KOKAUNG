import { Schema, model, Document, Types } from 'mongoose';

export interface IReviewDocument extends Document {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  booking?: Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
}

const reviewSchema = new Schema<IReviewDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ tour: 1, isApproved: 1 });
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

export const Review = model<IReviewDocument>('Review', reviewSchema);
