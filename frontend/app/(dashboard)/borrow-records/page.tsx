'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Borrow, PaginatedResponse } from '@/types';
import { formatDate } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { borrowService } from '@/services/borrow-service';
import DataTable, { Column } from '@/components/data-table';
import Badge, { borrowStatusVariant } from '@/components/badge';
import { Button } from '@/components/ui/button';
import TopNav from '@/components/top-nav';

export default function BorrowRecordsPage() {
    const [response, setResponse] = useState<PaginatedResponse<Borrow> | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [returning, setReturning] = useState<number | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await borrowService.list(page);
        setResponse(data);
        setLoading(false);
    }, [page]);

    useEffect(() => { load(); }, [load]);

    const handleReturn = async (id: number) => {
        if (!confirm('Mark this item as returned?')) return;
        setReturning(id);
        try {
            await borrowService.returnItem(id);
            load();
        } finally {
            setReturning(null);
        }
    };

    const columns: Column<Borrow>[] = [
        { key: 'id', header: '#', render: (b) => `#${b.id}` },
        { key: 'item', header: 'Item', render: (b) => b.item?.name ?? '—' },
        { key: 'borrower_name', header: 'Borrower' },
        { key: 'borrower_contact', header: 'Contact' },
        { key: 'quantity', header: 'Qty', render: (b) => String(b.quantity) },
        { key: 'borrow_date', header: 'Borrowed', render: (b) => formatDate(b.borrow_date) },
        { key: 'expected_return', header: 'Due', render: (b) => formatDate(b.expected_return_date) },
        { key: 'returned_date', header: 'Returned', render: (b) => formatDate(b.returned_date) },
        {
            key: 'status', header: 'Status',
            render: (b) => <Badge variant={borrowStatusVariant(b.status)}>{b.status}</Badge>,
        },
        {
            key: 'actions', header: '',
            render: (b) =>
                b.status !== 'returned' ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        loading={returning === b.id}
                        onClick={() => handleReturn(b.id)}
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> Return
                    </Button>
                ) : null,
        },
    ];

    return (
        <>
            <TopNav title="Borrow Records" />
            <div className="flex-1 overflow-y-auto p-6">
                <DataTable
                    columns={columns}
                    data={response?.data ?? []}
                    keyField="id"
                    pagination={response ?? undefined}
                    onPageChange={setPage}
                    loading={loading}
                    emptyText="No borrow records found."
                />
            </div>
        </>
    );
}
