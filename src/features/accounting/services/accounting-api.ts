import { apiClient } from '@/services/api-client';

export interface AccountingSummary {
  total_revenue: number;
  total_expenses: number;
  outstanding_invoices: number;
  net_income: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  guest?: { id: number; full_name: string; email: string | null };
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  notes: string | null;
  created_at: string;
}

export interface Payment {
  id: number;
  amount: number;
  method: string;
  reference: string | null;
  status: string;
  guest?: { id: number; full_name: string };
  notes: string | null;
  created_at: string;
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor: string | null;
  notes: string | null;
  created_at: string;
}

export const accountingApi = {
  getSummary: async (): Promise<AccountingSummary> => {
    const { data } = await apiClient.get('/accounting/summary');
    return data;
  },
  getInvoices: async (params?: { status?: string; page?: number }) => {
    const { data } = await apiClient.get('/accounting/invoices', { params });
    return data;
  },
  createInvoice: async (payload: { guest_id: number; reservation_id?: number; subtotal: number; tax_amount?: number; discount_amount?: number; issue_date: string; due_date: string; notes?: string }) => {
    const { data } = await apiClient.post('/accounting/invoices', payload);
    return data;
  },
  getPayments: async (params?: { method?: string; page?: number }) => {
    const { data } = await apiClient.get('/accounting/payments', { params });
    return data;
  },
  createPayment: async (payload: { guest_id: number; invoice_id?: number; reservation_id?: number; amount: number; method: string; reference?: string; notes?: string }) => {
    const { data } = await apiClient.post('/accounting/payments', payload);
    return data;
  },
  getExpenses: async (params?: { category?: string; page?: number }) => {
    const { data } = await apiClient.get('/accounting/expenses', { params });
    return data;
  },
  createExpense: async (payload: { category: string; description: string; amount: number; date: string; vendor?: string; notes?: string }) => {
    const { data } = await apiClient.post('/accounting/expenses', payload);
    return data;
  },
};
