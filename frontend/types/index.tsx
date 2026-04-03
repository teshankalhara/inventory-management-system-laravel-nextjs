/**
 * types/index.tsx
 * 
 * @updated 03/10/2026
 */
export type Role = 'admin' | 'staff';
export type ItemStatus = 'in-store' | 'borrowed' | 'damaged' | 'missing';
export type BorrowStatus = 'borrowed' | 'returned' | 'overdue';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface Cupboard {
  id: number;
  name: string;
  location: string | null;
  places_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Place {
  id: number;
  name: string;
  cupboard_id: number;
  cupboard?: Cupboard;
  items_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PlacePayload {
  name: string;
  cupboard_id: number;
}

export interface CupboardPayload {
  name: string;
  location?: string;
}


export interface Cupboard {
  id: number;
  name: string;
  location: string | null;
  places_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Place {
  id: number;
  name: string;
  cupboard_id: number;
  cupboard?: Cupboard;
  items_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: number;
  name: string;
  code: string;
  quantity: number;
  serial_number: string | null;
  description: string | null;
  image_path: string | null;
  place_id: number;
  place?: Place;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface ItemPayload {
  name: string;
  code: string;
  quantity: number;
  serial_number?: string;
  description?: string;
  place_id: number;
  status: ItemStatus;
  image?: File;
}

export interface BorrowPayload {
  item_id: number;
  borrower_name: string;
  borrower_contact: string;
  quantity: number;
  borrow_date: string;
  expected_return_date: string;
}

export interface Borrow {
  id: number;
  item_id: number;
  item?: Item;
  borrower_name: string;
  borrower_contact: string;
  quantity: number;
  borrow_date: string;
  expected_return_date: string;
  returned_date: string | null;
  status: BorrowStatus;
  created_by: number | null;
  creator?: User;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  user?: User;
  action: string;
  entity_type: string;
  entity_id: number;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
}