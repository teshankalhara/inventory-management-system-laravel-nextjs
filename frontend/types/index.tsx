/**
 * types/index.tsx
 * 
 * @updated 03/10/2026
 */
export type Role = 'admin' | 'staff';

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