export type PaymentMethod = 'kpay' | 'wavepay' | 'cash' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface IPaymentSimulation {
  phoneNumber: string;
  transactionId?: string;
  otpVerified: boolean;
  simulatedAt?: Date;
}

export interface IPayment {
  _id: string;
  booking: string;
  user: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  simulation?: IPaymentSimulation;
  status: PaymentStatus;
  paidAt?: Date;
  failedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulatePaymentPayload {
  bookingId: string;
  method: 'kpay' | 'wavepay';
  phoneNumber: string;
  otp: string;
}
