import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('a9token') || localStorage.getItem('admin_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Only redirect if NOT already on login page and NOT on public pages
      const path = window.location.pathname;
      const isPublicPage = path.startsWith('/tours') || path.startsWith('/hotels') || path.startsWith('/cars') || path.startsWith('/insurance') || path.startsWith('/visas') || path.startsWith('/cruises') || path === '/';
      if (!path.includes('/auth/login') && !path.includes('/auth/register') && !isPublicPage) {
        localStorage.removeItem('a9token'); localStorage.removeItem('admin_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Generic typed response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Typed API helpers
export const api = {
  get: <T = unknown>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<T>>(url, { params }).then((res) => res.data),
  post: <T = unknown>(url: string, data?: unknown) =>
    apiClient.post<ApiResponse<T>>(url, data).then((res) => res.data),
  put: <T = unknown>(url: string, data?: unknown) =>
    apiClient.put<ApiResponse<T>>(url, data).then((res) => res.data),
  delete: <T = unknown>(url: string) =>
    apiClient.delete<ApiResponse<T>>(url).then((res) => res.data),
};

// ─── Type Definitions ────────────────────────────────────────

export interface SearchParams {
  query?: string;
  type?: 'all' | 'tours' | 'hotels' | 'cars';
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  travelDate?: string;
  currency?: 'MMK' | 'USD';
  page?: number;
  limit?: number;
}

export interface SearchResults {
  tours: Tour[];
  hotels: Hotel[];
  cars: Car[];
}

export interface Tour {
  _id: string;
  slug: string;
  title: string;
  destination: string;
  description: string;
  priceMMK: number;
  priceUSD: number;
  duration: string | number;
  durationUnit?: string;
  groupSize: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  featured: boolean;
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
}

export interface Hotel {
  _id: string;
  slug: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNightMMK: number;
  pricePerNightUSD: number;
  images: string[] | string;  // API returns space-separated string
  amenities: string[];
  availableRooms: number;
  description: string;
}

export interface Car {
  _id: string;
  slug: string;
  carType: string;
  capacity: number;
  images: string[];
  features: string[];
  pricingWithDriver: {
    duration: string;
    priceMMK: number;
    priceUSD: number;
  }[];
  description: string;
}

export interface BookingData {
  itemType: 'tour' | 'hotel' | 'car';
  itemId: string;
  travelDate?: string;
  quantity?: number;
  travelers?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  totalAmount: number;
  currency: 'MMK' | 'USD';
  paymentMethod: 'kbzpay' | 'wavepay' | 'bank_transfer';
  transactionId?: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  itemType: string;
  itemId: string;
  itemName: string;
  travelDate: string;
  quantity: number;
  travelers: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  transactionId: string;
  createdAt: string;
}

export interface PaymentData {
  paymentMethod: 'kbzpay' | 'wavepay' | 'bank_transfer';
  transactionId: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

// ─── API Functions ───────────────────────────────────────────

// Search
export const searchAll = (params: SearchParams): Promise<ApiResponse<SearchResults>> =>
  api.get<SearchResults>('/search', params as Record<string, unknown>);

// Tours
export const getTours = (params?: {
  page?: number;
  limit?: number;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}): Promise<ApiResponse<Tour[]>> =>
  api.get<Tour[]>('/tours', params as Record<string, unknown>);

export const getTour = (slug: string): Promise<ApiResponse<Tour>> =>
  api.get<Tour>(`/tours/${slug}`);

export const getFeaturedTours = (): Promise<ApiResponse<Tour[]>> =>
  api.get<Tour[]>('/tours/featured');

// Hotels
export const getHotels = (params?: {
  page?: number;
  limit?: number;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}): Promise<ApiResponse<Hotel[]>> =>
  api.get<Hotel[]>('/hotels', params as Record<string, unknown>);

export const getHotel = (slug: string): Promise<ApiResponse<Hotel>> =>
  api.get<Hotel>(`/hotels/${slug}`);

// Cars
export const getCars = (params?: {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}): Promise<ApiResponse<Car[]>> =>
  api.get<Car[]>('/cars', params as Record<string, unknown>);

export const getCar = (slug: string): Promise<ApiResponse<Car>> =>
  api.get<Car>(`/cars/${slug}`);

// Visas & Insurance
export const getVisas = (): Promise<ApiResponse<unknown[]>> =>
  api.get<unknown[]>('/visas');

export const getInsurance = (): Promise<ApiResponse<unknown[]>> =>
  api.get<unknown[]>('/insurance');

// Booking
export const createBooking = (data: BookingData): Promise<ApiResponse<Booking>> =>
  api.post<Booking>('/bookings', data);

export const processPayment = (
  bookingId: string,
  data: PaymentData
): Promise<ApiResponse<{ paymentStatus: string }>> =>
  api.put<{ paymentStatus: string }>(`/bookings/${bookingId}/payment`, data);

// Auth
export const login = (data: LoginData): Promise<ApiResponse<AuthResponse>> =>
  api.post<AuthResponse>('/auth/login', data);

export const register = (data: RegisterData): Promise<ApiResponse<AuthResponse>> =>
  api.post<AuthResponse>('/auth/register', data);

// Profile
export const getProfile = (): Promise<ApiResponse<UserProfile>> =>
  api.get<UserProfile>('/auth/profile');

export default apiClient;
