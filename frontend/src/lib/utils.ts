import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number, currency = 'MMK'): string {
  return new Intl.NumberFormat('en-MM', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
