import type { PaymentMethod } from '../types/payment.types';

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'kpay', label: 'KBZ Pay', icon: 'kpay' },
  { id: 'wavepay', label: 'Wave Pay', icon: 'wavepay' },
];
