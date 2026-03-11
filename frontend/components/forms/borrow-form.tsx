'use client';

import { useState, useEffect } from 'react';
import type { BorrowPayload, Item } from '@/types';
import { itemService } from '@/services/item-service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
  onSubmit: (data: BorrowPayload) => Promise<void>;
  onCancel: () => void;
  preselectedItemId?: number;
}

export default function BorrowForm({ onSubmit, onCancel, preselectedItemId }: Props) {
  const [items, setItems]   = useState<Item[]>([]);
  const [form, setForm]     = useState<BorrowPayload>({
    item_id:              preselectedItemId ?? 0,
    borrower_name:        '',
    borrower_contact:     '',
    quantity:             1,
    borrow_date:          new Date().toISOString().split('T')[0],
    expected_return_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    // Load only in-store items
    itemService.list(1).then((res) => {
      setItems(res.data.filter((i) => i.status === 'in-store' && i.quantity > 0));
    });
  }, []);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'item_id' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const selectedItem = items.find((i) => i.id === form.item_id);

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

      <Field label="Item">
        <select name="item_id" value={form.item_id} onChange={handle} required className="input">
          <option value={0} disabled>Select an item…</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              [{i.code}] {i.name} — {i.quantity} available
            </option>
          ))}
        </select>
        {selectedItem && (
          <p className="mt-1 text-xs text-slate-500">
            Available stock: <strong>{selectedItem.quantity}</strong>
          </p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Borrower Name">
          <Input name="borrower_name" value={form.borrower_name} onChange={handle} required className="input" />
        </Field>
        <Field label="Borrower Contact">
          <Input name="borrower_contact" value={form.borrower_contact} onChange={handle} required className="input" />
        </Field>
        <Field label="Quantity">
          <Input name="quantity" type="number" min={1}
            max={selectedItem?.quantity ?? 9999}
            value={form.quantity} onChange={handle} required className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Borrow Date">
          <Input name="borrow_date" type="date" value={form.borrow_date} onChange={handle} required className="input" />
        </Field>
        <Field label="Expected Return Date">
          <Input name="expected_return_date" type="date" value={form.expected_return_date}
            min={form.borrow_date} onChange={handle} required className="input" />
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Confirm Borrow</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
