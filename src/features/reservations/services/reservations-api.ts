import { apiClient } from '@/services/api-client';
import type { PaginatedResponse, Reservation } from '@/types/api';

export interface ReservationFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  guest_id?: number;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface CreateReservationPayload {
  guest_first_name: string;
  guest_last_name: string;
  guest_email?: string;
  guest_phone?: string;
  room_type_id: number;
  room_id?: number;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children?: number;
  rate_per_night?: number;
  discount_amount?: number;
  source?: string;
  special_requests?: string;
}

export const reservationsApi = {
  list: async (filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>> => {
    const { data } = await apiClient.get('/reservations', { params: filters });
    return data;
  },

  get: async (id: number): Promise<Reservation> => {
    const { data } = await apiClient.get(`/reservations/${id}`);
    return data;
  },

  create: async (payload: CreateReservationPayload): Promise<Reservation> => {
    const { data } = await apiClient.post('/reservations', payload);
    return data;
  },

  confirm: async (id: number): Promise<Reservation> => {
    const { data } = await apiClient.post(`/reservations/${id}/confirm`);
    return data;
  },

  checkIn: async (id: number, roomId?: number): Promise<Reservation> => {
    const { data } = await apiClient.post(`/reservations/${id}/check-in`, {
      room_id: roomId,
    });
    return data;
  },

  checkOut: async (id: number): Promise<Reservation> => {
    const { data } = await apiClient.post(`/reservations/${id}/check-out`);
    return data;
  },

  cancel: async (id: number): Promise<Reservation> => {
    const { data } = await apiClient.post(`/reservations/${id}/cancel`);
    return data;
  },

  todayArrivals: async (): Promise<PaginatedResponse<Reservation>> => {
    const { data } = await apiClient.get('/front-desk/arrivals');
    return data;
  },

  todayDepartures: async (): Promise<PaginatedResponse<Reservation>> => {
    const { data } = await apiClient.get('/front-desk/departures');
    return data;
  },
};
