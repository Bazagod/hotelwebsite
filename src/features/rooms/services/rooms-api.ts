import { apiClient } from '@/services/api-client';
import type { PaginatedResponse, Room, RoomType } from '@/types/api';

export interface RoomFilters {
  status?: string;
  room_type_id?: number;
  floor?: number;
  is_clean?: boolean;
  per_page?: number;
  page?: number;
}

export interface CreateRoomPayload {
  room_type_id: number;
  number: string;
  floor: number;
  status?: string;
  notes?: string;
}

export interface CreateRoomTypePayload {
  name: string;
  description?: string;
  base_price: number;
  max_occupancy: number;
  amenities?: string[];
  bed_type?: string;
  size?: string;
  view?: string;
}

export const roomsApi = {
  list: async (filters?: RoomFilters): Promise<PaginatedResponse<Room>> => {
    const { data } = await apiClient.get('/rooms', { params: filters });
    return data;
  },

  get: async (id: number): Promise<Room> => {
    const { data } = await apiClient.get(`/rooms/${id}`);
    return data;
  },

  create: async (payload: CreateRoomPayload): Promise<Room> => {
    const { data } = await apiClient.post('/rooms', payload);
    return data;
  },

  update: async (id: number, payload: Partial<CreateRoomPayload>): Promise<Room> => {
    const { data } = await apiClient.put(`/rooms/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },

  checkAvailability: async (
    checkIn: string,
    checkOut: string,
    roomTypeId?: number
  ): Promise<Room[]> => {
    const { data } = await apiClient.get('/rooms-availability', {
      params: { check_in: checkIn, check_out: checkOut, room_type_id: roomTypeId },
    });
    return data.data;
  },

  listTypes: async (page = 1): Promise<PaginatedResponse<RoomType>> => {
    const { data } = await apiClient.get('/room-types', { params: { page } });
    return data;
  },

  createType: async (payload: CreateRoomTypePayload): Promise<RoomType> => {
    const { data } = await apiClient.post('/room-types', payload);
    return data;
  },

  updateType: async (id: number, payload: Partial<CreateRoomTypePayload>): Promise<RoomType> => {
    const { data } = await apiClient.put(`/room-types/${id}`, payload);
    return data;
  },
};
