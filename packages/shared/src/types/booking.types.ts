export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'cancelled'
  | 'completed'
  | 'refunded';

export interface ITravelers {
  adults: number;
  children: number;
  infants: number;
}

export interface IContactInfo {
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface IBookingPricing {
  pricePerPerson: number;
  totalTravelers: number;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  currency: string;
}

export interface IBooking {
  _id: string;
  bookingRef: string;
  user: string;
  tour: string;
  travelDate: { startDate: Date; endDate: Date };
  travelers: ITravelers;
  contactInfo: IContactInfo;
  pricing: IBookingPricing;
  status: BookingStatus;
  payment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingPayload {
  tourId: string;
  startDate: string;
  endDate: string;
  travelers: ITravelers;
  contactInfo: IContactInfo;
}
