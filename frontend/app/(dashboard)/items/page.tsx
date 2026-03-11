'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Item, ItemPayload, PaginatedResponse } from '@/types';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { itemService } from '@/services/item-service';
import DataTable, { Column } from '@/components/data-table';
import Badge, { itemStatusVariant } from '@/components/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from '@/components/modal';
import TopNav from '@/components/top-nav';
import ItemForm from '@/components/forms/item-form';

export default function ItemsPage() {
    const [response, setResponse] = useState<PaginatedResponse<Item> | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'create' | 'edit' | null>(null);
    const [selected, setSelected] = useState<Item | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await itemService.list(page, search || undefined);
        setResponse(data);
        setLoading(false);
    }, [page, search]);

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [load]);

    const openCreate = () => { setSelected(null); setModal('create'); };
    const openEdit = (i: Item) => { setSelected(i); setModal('edit'); };
    const close = () => { setModal(null); setSelected(null); };

    const handleSubmit = async (data: ItemPayload) => {
        selected ? await itemService.update(selected.id, data) : await itemService.create(data);
        close();
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this item?')) return;
        await itemService.remove(id);
        load();
    };

    const columns: Column<Item>[] = [
        { key: 'code', header: 'Code', render: (i) => <span className="font-mono text-xs">{i.code}</span> },
        { key: 'name', header: 'Name' },
        { key: 'quantity', header: 'Qty', render: (i) => String(i.quantity) },
        { key: 'place', header: 'Location', render: (i) => i.place ? `${i.place.cupboard?.name} → ${i.place.name}` : '—' },
        {
            key: 'status', header: 'Status',
            render: (i) => <Badge variant={itemStatusVariant(i.status)}>{i.status}</Badge>,
        },
        { key: 'updated_at', header: 'Updated', render: (i) => formatDate(i.updated_at) },
        {
            key: 'actions', header: '',
            render: (i) => (
                <div className="flex items-center gap-1">
                    <Link href={`/items/${i.id}`}>
                        <Button size="sm" variant="ghost"><Eye className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(i)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(i.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <TopNav title="Inventory Items" />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="input pl-9"
                            placeholder="Search name or code…"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="ml-auto">
                        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Item</Button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={response?.data ?? []}
                    keyField="id"
                    pagination={response ?? undefined}
                    onPageChange={setPage}
                    loading={loading}
                />
            </div>

            <Modal open={!!modal} onClose={close} title={selected ? 'Edit Item' : 'Add Item'} size="xl">
                <ItemForm initial={selected ?? undefined} onSubmit={handleSubmit} onCancel={close} />
            </Modal>
        </>
    );
}
