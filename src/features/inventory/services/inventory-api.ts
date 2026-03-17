import { apiClient } from '@/services/api-client';

export interface InventoryCategory {
  id: number;
  name: string;
  description: string | null;
  items_count?: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku: string | null;
  description: string | null;
  quantity: number;
  min_quantity: number;
  unit: string;
  unit_cost: number;
  location: string | null;
  is_active: boolean;
  is_low_stock: boolean;
  category?: InventoryCategory;
}

export interface InventoryTransaction {
  id: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  quantity_before: number;
  quantity_after: number;
  reason: string | null;
  item?: InventoryItem;
  performed_by_name?: string;
  created_at: string;
}

export const inventoryApi = {
  getCategories: async () => {
    const { data } = await apiClient.get('/inventory/categories');
    return data;
  },
  createCategory: async (payload: { name: string; description?: string }) => {
    const { data } = await apiClient.post('/inventory/categories', payload);
    return data;
  },
  getItems: async (params?: { category_id?: number; low_stock?: boolean; page?: number; per_page?: number }) => {
    const { data } = await apiClient.get('/inventory/items', { params });
    return data;
  },
  createItem: async (payload: { category_id: number; name: string; sku?: string; quantity?: number; min_quantity?: number; unit?: string; unit_cost?: number; location?: string }) => {
    const { data } = await apiClient.post('/inventory/items', payload);
    return data;
  },
  adjustStock: async (id: number, payload: { type: 'in' | 'out' | 'adjustment'; quantity: number; reason?: string }) => {
    const { data } = await apiClient.post(`/inventory/items/${id}/adjust`, payload);
    return data;
  },
  getTransactions: async (params?: { page?: number }) => {
    const { data } = await apiClient.get('/inventory/transactions', { params });
    return data;
  },
};
