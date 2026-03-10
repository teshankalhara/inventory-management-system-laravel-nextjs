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
