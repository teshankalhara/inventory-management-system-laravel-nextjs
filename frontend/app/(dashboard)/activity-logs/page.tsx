'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ActivityLog, PaginatedResponse } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { activityLogService } from '@/services/activity-log-service';
import DataTable, { Column } from '@/components/data-table';
import TopNav from '@/components/top-nav';

export default function ActivityLogsPage() {
    const [response, setResponse] = useState<PaginatedResponse<ActivityLog> | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await activityLogService.list(page);
        setResponse(data);
        setLoading(false);
    }, [page]);

    useEffect(() => { load(); }, [load]);

    const columns: Column<ActivityLog>[] = [
        { key: 'id', header: '#', render: (l) => `#${l.id}` },
        { key: 'user', header: 'User', render: (l) => l.user?.name ?? 'System' },
        {
            key: 'action', header: 'Action',
            render: (l) => (
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700">
                    {l.action}
                </span>
            ),
        },
        { key: 'entity_type', header: 'Entity', render: (l) => `${l.entity_type} #${l.entity_id}` },
        {
            key: 'changes', header: 'Changes',
            render: (l) => (
                <div className="max-w-xs space-y-1 text-xs text-slate-500">
                    {l.old_value && (
                        <p className="truncate">
                            <span className="font-medium text-red-600">Before: </span>
                            {JSON.stringify(l.old_value)}
                        </p>
                    )}
                    {l.new_value && (
                        <p className="truncate">
                            <span className="font-medium text-emerald-600">After: </span>
                            {JSON.stringify(l.new_value)}
                        </p>
                    )}
                </div>
            ),
        },
        { key: 'created_at', header: 'When', render: (l) => formatDateTime(l.created_at) },
    ];

    return (
        <>
            <TopNav title="Activity Logs" />
            <div className="flex-1 overflow-y-auto p-6">
                <DataTable
                    columns={columns}
                    data={response?.data ?? []}
                    keyField="id"
                    pagination={response ?? undefined}
                    onPageChange={setPage}
                    loading={loading}
                    emptyText="No activity recorded yet."
                />
            </div>
        </>
    );
}
