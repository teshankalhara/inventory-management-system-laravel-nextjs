'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '@/components/data-table';
import { Cupboard, Place, PlacePayload } from '@/types';
import TopNav from '@/components/top-nav';
import Modal from '@/components/modal';
import { placeService } from '@/services/place-service';
import { cupboardService } from '@/services/cupboard-service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PlacesPage() {
    const [data, setData] = useState<Place[]>([]);
    const [cupboards, setCupboards] = useState<Cupboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState<Place | null>(null);
    const [form, setForm] = useState<PlacePayload>({ name: '', cupboard_id: 0 });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const [places, cbs] = await Promise.all([placeService.list(), cupboardService.list()]);
        setData(places);
        setCupboards(cbs);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => { setSelected(null); setForm({ name: '', cupboard_id: 0 }); setModal(true); };
    const openEdit = (p: Place) => { setSelected(p); setForm({ name: p.name, cupboard_id: p.cupboard_id }); setModal(true); };
    const close = () => { setModal(false); setSelected(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            selected ? await placeService.update(selected.id, form) : await placeService.create(form);
            close();
            load();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this place?')) return;
        await placeService.remove(id);
        load();
    };

    const columns: Column<Place>[] = [
        { key: 'name', header: 'Place Name' },
        { key: 'cupboard', header: 'Cupboard', render: (p) => p.cupboard?.name ?? '—' },
        { key: 'items_count', header: 'Items', render: (p) => String(p.items_count ?? 0) },
        { key: 'created_at', header: 'Created', render: (p) => formatDate(p.created_at) },
        {
            key: 'actions', header: '',
            render: (p) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <TopNav title="Places" />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-5 flex justify-end">
                    <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Place</Button>
                </div>
                <DataTable columns={columns} data={data} keyField="id" loading={loading} />
            </div>

            <Modal open={modal} onClose={close} title={selected ? 'Edit Place' : 'Add Place'} size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Name</Label>
                        <Input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Cupboard</Label>
                        <select className="input" value={form.cupboard_id} onChange={(e) => setForm((p) => ({ ...p, cupboard_id: Number(e.target.value) }))} required>
                            <option value={0} disabled>Select a cupboard…</option>
                            {cupboards.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
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
