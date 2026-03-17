import { apiClient } from '@/services/api-client';

export interface MenuCategory {
  id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
  items_count?: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  is_available: boolean;
  is_active: boolean;
  category?: MenuCategory;
}

export interface OrderItem {
  id: number;
  menu_item: MenuItem;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
}

export interface RestaurantOrder {
  id: number;
  order_number: string;
  table_number: string | null;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
}

export const restaurantApi = {
  getCategories: async () => {
    const { data } = await apiClient.get('/restaurant/categories');
    return data;
  },
  createCategory: async (payload: { name: string; sort_order?: number }) => {
    const { data } = await apiClient.post('/restaurant/categories', payload);
    return data;
  },
  getMenu: async (categoryId?: number) => {
    const { data } = await apiClient.get('/restaurant/menu', { params: { category_id: categoryId } });
    return data;
  },
  createMenuItem: async (payload: { category_id: number; name: string; description?: string; price: number }) => {
    const { data } = await apiClient.post('/restaurant/menu', payload);
    return data;
  },
  getOrders: async (params?: { status?: string; page?: number }) => {
    const { data } = await apiClient.get('/restaurant/orders', { params });
    return data;
  },
  createOrder: async (payload: { table_number?: string; items: { menu_item_id: number; quantity: number; notes?: string }[] }) => {
    const { data } = await apiClient.post('/restaurant/orders', payload);
    return data;
  },
  updateOrderStatus: async (id: number, status: string) => {
    const { data } = await apiClient.put(`/restaurant/orders/${id}/status`, { status });
    return data;
  },
};
