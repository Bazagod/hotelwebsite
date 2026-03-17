import { apiClient } from '@/services/api-client';
import type { Department, PaginatedResponse, Staff } from '@/types/api';

export interface StaffFilters {
  department_id?: number;
  is_active?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface CreateStaffPayload {
  department_id?: number;
  employee_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position: string;
  salary?: number;
  salary_type?: string;
  hire_date: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

export const staffApi = {
  list: async (filters?: StaffFilters): Promise<PaginatedResponse<Staff>> => {
    const { data } = await apiClient.get('/staff', { params: filters });
    return data;
  },

  get: async (id: number): Promise<Staff> => {
    const { data } = await apiClient.get(`/staff/${id}`);
    return data;
  },

  create: async (payload: CreateStaffPayload): Promise<Staff> => {
    const { data } = await apiClient.post('/staff', payload);
    return data;
  },

  update: async (id: number, payload: Partial<CreateStaffPayload>): Promise<Staff> => {
    const { data } = await apiClient.put(`/staff/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },

  listDepartments: async (): Promise<PaginatedResponse<Department>> => {
    const { data } = await apiClient.get('/departments');
    return data;
  },

  createDepartment: async (payload: { name: string; code?: string; description?: string }): Promise<Department> => {
    const { data } = await apiClient.post('/departments', payload);
    return data;
  },
};
