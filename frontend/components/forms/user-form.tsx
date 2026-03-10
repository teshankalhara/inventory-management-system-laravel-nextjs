'use client';

import { useState } from 'react';
import type { User, UserPayload } from '@/types';
import { Button } from '../ui/button';

interface Props {
  initial?: User;
  onSubmit: (data: UserPayload) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<UserPayload>({
    name:     initial?.name ?? '',
    email:    initial?.email ?? '',
    password: '',
    role:     initial?.role ?? 'staff',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'An error occurred.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      <Field label="Full Name">
        <input name="name" value={form.name} onChange={handle} required
          className="input" placeholder="John Doe" />
      </Field>

      <Field label="Email">
        <input name="email" type="email" value={form.email} onChange={handle} required
          className="input" placeholder="john@company.com" />
      </Field>

      <Field label={initial ? 'New Password (leave blank to keep)' : 'Password'}>
        <input name="password" type="password" value={form.password} onChange={handle}
          required={!initial} className="input" placeholder="••••••••" />
      </Field>

      <Field label="Role">
        <select name="role" value={form.role} onChange={handle} className="input">
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Update' : 'Create'} User</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}
