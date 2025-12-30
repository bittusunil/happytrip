import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newTokens = await this.refreshAccessToken();
            this.setTokens(newTokens.accessToken, newTokens.refreshToken);
            return this.api(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    // Load tokens from localStorage
    this.loadTokensFromStorage();
  }

  // Token Management
  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  private getAccessToken(): string | null {
    return this.accessToken;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Auth Endpoints
  async register(email: string, password: string, firstName: string, lastName: string) {
    const response = await this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });

    const { accessToken, refreshToken, user } = response.data;
    this.setTokens(accessToken, refreshToken);

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;
    this.setTokens(accessToken, refreshToken);

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  }

  async refreshAccessToken() {
    const response = await this.api.post<AuthResponse>('/auth/refresh', {
      refreshToken: this.refreshToken,
    });

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  }

  logout() {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // User Endpoints
  async getProfile() {
    const response = await this.api.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.api.put('/users/profile', data);
    return response.data;
  }

  async updatePreferences(language: string, currency: string) {
    const response = await this.api.put('/users/profile/preferences', {
      language,
      currency,
    });
    return response.data;
  }

  // Flight Endpoints
  async searchFlights(params: any) {
    const response = await this.api.get('/flights/search', { params });
    return response.data;
  }

  async getFlightById(id: string) {
    const response = await this.api.get(`/flights/${id}`);
    return response.data;
  }

  async getFlightsByAirline(airline: string) {
    const response = await this.api.get(`/flights/airline/${airline}`);
    return response.data;
  }

  // Accommodation Endpoints
  async searchAccommodations(params: any) {
    const response = await this.api.get('/accommodations/search', { params });
    return response.data;
  }

  async getAccommodationById(id: string) {
    const response = await this.api.get(`/accommodations/${id}`);
    return response.data;
  }

  async getAccommodationsByCity(city: string) {
    const response = await this.api.get(`/accommodations/city/${city}`);
    return response.data;
  }

  async getAccommodationsByType(type: string) {
    const response = await this.api.get(`/accommodations/type/${type}`);
    return response.data;
  }

  async getAccommodationReviews(id: string) {
    const response = await this.api.get(`/accommodations/${id}/reviews`);
    return response.data;
  }

  async addAccommodationReview(id: string, reviewData: any) {
    const response = await this.api.post(`/accommodations/${id}/reviews`, reviewData);
    return response.data;
  }

  // Booking Endpoints
  async createBooking(bookingData: any) {
    const response = await this.api.post('/bookings', bookingData);
    return response.data;
  }

  async getBookings(page: number = 1, limit: number = 10) {
    const response = await this.api.get('/bookings', {
      params: { page, limit },
    });
    return response.data;
  }

  async getBookingById(id: string) {
    const response = await this.api.get(`/bookings/${id}`);
    return response.data;
  }

  async getBookingByReference(referenceId: string) {
    const response = await this.api.get(`/bookings/reference/${referenceId}`);
    return response.data;
  }

  async updateBooking(id: string, data: any) {
    const response = await this.api.put(`/bookings/${id}`, data);
    return response.data;
  }

  async updateBookingStatus(id: string, status: string) {
    const response = await this.api.put(`/bookings/${id}/status`, { status });
    return response.data;
  }

  async cancelBooking(id: string) {
    const response = await this.api.put(`/bookings/${id}/cancel`);
    return response.data;
  }
}

export const apiService = new ApiService();
