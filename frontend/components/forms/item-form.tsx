'use client';

import { useState, useEffect } from 'react';
import type { Item, ItemPayload, Place } from '@/types';
import { placeService } from '@/services/place-service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
    initial?: Item;
    onSubmit: (data: ItemPayload) => Promise<void>;
    onCancel: () => void;
}

const STATUS_OPTIONS = ['in-store', 'borrowed', 'damaged', 'missing'] as const;

export default function ItemForm({ initial, onSubmit, onCancel }: Props) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [form, setForm] = useState<ItemPayload>({
        name: initial?.name ?? '',
        code: initial?.code ?? '',
        quantity: initial?.quantity ?? 0,
        serial_number: initial?.serial_number ?? '',
        description: initial?.description ?? '',
        place_id: initial?.place_id ?? 0,
        status: initial?.status ?? 'in-store',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        placeService.list().then(setPlaces);
    }, []);

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'quantity' || name === 'place_id' ? Number(value) : value,
        }));
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setForm((prev) => ({ ...prev, image: file }));
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

            <div className="grid grid-cols-2 gap-4">
                <Field label="Item Name">
                    <Input name="name" value={form.name} onChange={handle} required className="input" />
                </Field>
                <Field label="Item Code">
                    <Input name="code" value={form.code} onChange={handle} required className="input" />
                </Field>
                <Field label="Quantity">
                    <Input name="quantity" type="number" min={0} value={form.quantity} onChange={handle} required className="input" />
                </Field>
                <Field label="Serial Number">
                    <Input name="serial_number" value={form.serial_number} onChange={handle} className="input" />
                </Field>
            </div>

            <Field label="Storage Place">
                <select name="place_id" value={form.place_id} onChange={handle} required className="input">
                    <option value={0} disabled>Select a place…</option>
                    {places.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.cupboard?.name} → {p.name}
                        </option>
                    ))}
                </select>
            </Field>

            <Field label="Status">
                <select name="status" value={form.status} onChange={handle} className="input">
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                </select>
            </Field>

            <Field label="Description">
                <textarea name="description" value={form.description} onChange={handle}
                    rows={3} className="input" />
            </Field>

            <Field label="Image">
                <Input type="file" accept="image/*" onChange={handleFile}
                    className="block w-full text-sm text-slate-500 file:mr-3 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700" />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={loading}>{initial ? 'Update' : 'Create'} Item</Button>
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
