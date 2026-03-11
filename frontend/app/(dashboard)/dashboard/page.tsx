'use client';

import { useEffect, useState } from 'react';
import { Package, BookOpen, AlertTriangle, Activity } from 'lucide-react';
import { itemService } from '@/services/item-service';
import { borrowService } from '@/services/borrow-service';
import TopNav from '@/components/top-nav';

interface Stats {
    totalItems: number;
    activeBorrows: number;
    overdueBorrows: number;
    lowStock: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            itemService.list(1),
            borrowService.list(1),
        ]).then(([items, borrows]) => {
            setStats({
                totalItems: items.total,
                activeBorrows: borrows.data.filter((b) => b.status === 'borrowed').length,
                overdueBorrows: borrows.data.filter((b) => b.status === 'overdue').length,
                lowStock: items.data.filter((i) => i.quantity <= 2).length,
            });
        }).finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Total Items', value: stats?.totalItems, icon: Package, color: 'bg-indigo-500' },
        { label: 'Active Borrows', value: stats?.activeBorrows, icon: BookOpen, color: 'bg-blue-500' },
        { label: 'Overdue Returns', value: stats?.overdueBorrows, icon: AlertTriangle, color: 'bg-red-500' },
        { label: 'Low Stock Items', value: stats?.lowStock, icon: Activity, color: 'bg-amber-500' },
    ];

    return (
        <>
            <TopNav title="Dashboard" />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{label}</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {loading ? '—' : (value ?? 0)}
                                    </p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                    <h2 className="mb-1 text-lg font-semibold text-slate-800">Welcome back</h2>
                    <p className="text-sm text-slate-500">
                        Use the sidebar to navigate between inventory modules. Admins can manage users,
                        cupboards, places, and view activity logs.
                    </p>
                </div>
            </div>
        </>
    );
}
