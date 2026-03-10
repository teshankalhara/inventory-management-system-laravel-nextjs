import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'default';

const VARIANTS: Record<Variant, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-red-100 text-red-800',
  info:    'bg-blue-100 text-blue-800',
  default: 'bg-slate-100 text-slate-800',
};

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Map domain values to badge variants
export function itemStatusVariant(status: string): Variant {
  const map: Record<string, Variant> = {
    'in-store': 'success',
    borrowed:   'info',
    damaged:    'warning',
    missing:    'danger',
  };
  return map[status] ?? 'default';
}

export function borrowStatusVariant(status: string): Variant {
  const map: Record<string, Variant> = {
    borrowed: 'info',
    returned: 'success',
    overdue:  'danger',
  };
  return map[status] ?? 'default';
}
