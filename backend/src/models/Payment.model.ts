import { Schema, model, Document, Types } from 'mongoose';

export interface IPaymentDocument extends Document {
  booking: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  currency: string;
  method: string;
  simulation?: {
    phoneNumber: string;
    transactionId?: string;
    otpVerified: boolean;
    simulatedAt?: Date;
  };
  status: string;
  paidAt?: Date;
  failedReason?: string;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'MMK' },
    method: {
      type: String,
      enum: ['kpay', 'wavepay', 'cash', 'bank_transfer'],
      required: true,
    },
    simulation: {
      phoneNumber: { type: String },
      transactionId: { type: String },
      otpVerified: { type: Boolean, default: false },
      simulatedAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paidAt: { type: Date },
    failedReason: { type: String },
  },
  { timestamps: true }
);

paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ 'simulation.transactionId': 1 });

export const Payment = model<IPaymentDocument>('Payment', paymentSchema);
