import { type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => ReactNode;
    className?: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props<T> {
    columns: Column<T>[];
    data: T[];
    keyField: keyof T;
    pagination?: PaginationMeta;
    onPageChange?: (page: number) => void;
    loading?: boolean;
    emptyText?: string;
}

export default function DataTable<T>({
    columns,
    data,
    keyField,
    pagination,
    onPageChange,
    loading,
    emptyText = 'No records found.',
}: Props<T>) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${col.className ?? ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="py-16 text-center text-slate-400">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                                        Loading…
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="py-16 text-center text-slate-400">
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={String(row[keyField])}
                                    className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className={`px-4 py-3 text-slate-700 ${col.className ?? ''}`}>
                                            {col.render
                                                ? col.render(row)
                                                : String((row as Record<string, unknown>)[col.key] ?? '—')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">
                        Showing {pagination.from}–{pagination.to} of {pagination.total}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={pagination.current_page <= 1}
                            onClick={() => onPageChange?.(pagination.current_page - 1)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="px-2 text-sm font-medium text-slate-700">
                            {pagination.current_page} / {pagination.last_page}
                        </span>
                        <button
                            disabled={pagination.current_page >= pagination.last_page}
                            onClick={() => onPageChange?.(pagination.current_page + 1)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
