import { apiClient } from '@/services/api-client';

export interface ConferenceRoom {
  id: number;
  name: string;
  capacity: number;
  hourly_rate: number;
  daily_rate: number;
  equipment: string[] | null;
  description: string | null;
  is_active: boolean;
  today_bookings_count?: number;
}

export interface ConferenceBooking {
  id: number;
  conference_room?: ConferenceRoom;
  organizer_name: string;
  organizer_email: string | null;
  organizer_phone: string | null;
  event_name: string;
  date: string;
  start_time: string;
  end_time: string;
  attendees: number;
  total_amount: number;
  status: string;
  requirements: string[] | null;
  notes: string | null;
  created_at: string;
}

export const conferenceApi = {
  getRooms: async () => {
    const { data } = await apiClient.get('/conference/rooms');
    return data;
  },
  createRoom: async (payload: { name: string; capacity: number; hourly_rate: number; daily_rate: number; equipment?: string[]; description?: string }) => {
    const { data } = await apiClient.post('/conference/rooms', payload);
    return data;
  },
  getBookings: async (params?: { status?: string; date?: string; page?: number }) => {
    const { data } = await apiClient.get('/conference/bookings', { params });
    return data;
  },
  createBooking: async (payload: { conference_room_id: number; organizer_name: string; organizer_email?: string; organizer_phone?: string; event_name: string; date: string; start_time: string; end_time: string; attendees: number; requirements?: string[]; notes?: string }) => {
    const { data } = await apiClient.post('/conference/bookings', payload);
    return data;
  },
  updateBookingStatus: async (id: number, status: string) => {
    const { data } = await apiClient.put(`/conference/bookings/${id}/status`, { status });
    return data;
  },
};
