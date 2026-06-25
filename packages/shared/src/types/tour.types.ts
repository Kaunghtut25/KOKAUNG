export type TourCategory = 'luxury' | 'adventure' | 'cultural' | 'nature' | 'beach';
export type TourDifficulty = 'easy' | 'moderate' | 'challenging';

export interface IPrice {
  amount: number;
  currency: string;
  discount: number;
  finalPrice: number;
}

export interface IDuration {
  days: number;
  nights: number;
}

export interface IAvailableDate {
  startDate: Date;
  endDate: Date;
  slots: number;
  isActive: boolean;
}

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  accommodation?: string;
}

export interface ITour {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  description: string;
  shortDescription?: string;
  price: IPrice;
  duration: IDuration;
  maxGroupSize: number;
  minGroupSize: number;
  availableDates: IAvailableDate[];
  itinerary: IItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  tags: string[];
  rating: { average: number; count: number };
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TourSearchFilters {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  category?: TourCategory;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'date_asc' | 'rating';
}
