'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Cupboard, CupboardPayload } from '@/types';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { cupboardService } from '@/services/cupboard-service';
import DataTable, { Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TopNav from '@/components/top-nav';
import Modal from '@/components/modal';
import { toast } from 'sonner';

export default function CupboardsPage() {
    const [data, setData] = useState<Cupboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState<Cupboard | null>(null);
    const [form, setForm] = useState<CupboardPayload>({ name: '', location: '' });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const list = await cupboardService.list();
        setData(list);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => { setSelected(null); setForm({ name: '', location: '' }); setModal(true); };
    const openEdit = (c: Cupboard) => { setSelected(c); setForm({ name: c.name, location: c.location ?? '' }); setModal(true); };
    const close = () => { setModal(false); setSelected(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (selected) {
                await cupboardService.update(selected.id, form);
                toast.success('Cupboard updated successfully.');
            } else {
                await cupboardService.create(form);
                toast.success('Cupboard created successfully.');
            }
            close();
            await load();
        } catch {
            toast.error(selected ? 'Failed to update cupboard.' : 'Failed to create cupboard.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this cupboard and all its places?')) return;
        try {
            await cupboardService.remove(id);
            toast.success('Cupboard deleted successfully.');
            await load();
        } catch {
            toast.error('Failed to delete cupboard.');
        }
    };

    const columns: Column<Cupboard>[] = [
        { key: 'name', header: 'Name' },
        {
            key: 'location', header: 'Location',
            render: (c) => (
                <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="h-3.5 w-3.5" /> {c.location ?? '—'}
                </span>
            ),
        },
        { key: 'places_count', header: 'Places', render: (c) => String(c.places_count ?? 0) },
        { key: 'created_at', header: 'Created', render: (c) => formatDate(c.created_at) },
        {
            key: 'actions', header: '',
            render: (c) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <TopNav title="Cupboards" />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-5 flex justify-end">
                    <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Cupboard</Button>
                </div>

                <DataTable columns={columns} data={data} keyField="id" loading={loading} />
            </div>

            <Modal open={modal} onClose={close} title={selected ? 'Edit Cupboard' : 'Add Cupboard'} size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Name</Label>
                        <Input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Location</Label>
                        <Input className="input" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Room B2" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
                        <Button type="submit" loading={saving}>{selected ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
