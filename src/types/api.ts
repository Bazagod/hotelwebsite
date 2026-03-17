export interface Tenant {
  id: number;
  name: string;
  slug: string;
  currency: string;
  timezone: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  tenant: Tenant | null;
  is_super_admin: boolean;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface RoomType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  max_occupancy: number;
  amenities: string[] | null;
  images: string[] | null;
  bed_type: string | null;
  size: string | null;
  view: string | null;
  is_active: boolean;
  rooms_count?: number;
  created_at: string;
}

export interface Room {
  id: number;
  number: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'cleaning';
  is_clean: boolean;
  is_active: boolean;
  notes: string | null;
  room_type: RoomType;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  vip_status: string;
  total_stays: number;
  total_spent: number;
  created_at: string;
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';

export interface ReservationExtra {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  date: string;
}

export interface Reservation {
  id: number;
  confirmation_number: string;
  guest: Guest;
  room: Room | null;
  room_type: RoomType;
  check_in_date: string;
  check_out_date: string;
  actual_check_in: string | null;
  actual_check_out: string | null;
  nights: number;
  adults: number;
  children: number;
  rate_per_night: number;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  source: string;
  special_requests: string | null;
  extras: ReservationExtra[];
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: number;
  employee_id: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  position: string;
  department: Department | null;
  salary?: number;
  salary_type?: string;
  hire_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  is_active: boolean;
  staff_count?: number;
}

export interface OccupancyTrendPoint {
  date: string;
  occupancy: number;
  occupied: number;
}

export interface DashboardData {
  rooms: {
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
    occupancy_rate: number;
  };
  reservations: {
    today_arrivals: number;
    today_departures: number;
    pending: number;
  };
  revenue: {
    monthly: number;
  };
  occupancy_trend: OccupancyTrendPoint[];
  recent_reservations: {
    id: number;
    confirmation_number: string;
    guest_name: string;
    room_type: string;
    check_in: string;
    check_out: string;
    status: ReservationStatus;
    total: number;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
