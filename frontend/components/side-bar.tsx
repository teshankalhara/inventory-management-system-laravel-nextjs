'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/services/auth-service';
import { NAV_ITEMS } from '@/common/data';
import { LogOut, Package } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setAdmin(isAdmin());
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        router.push('/login');
    };

    const items = NAV_ITEMS.filter((item) => !item.adminOnly || admin);

    return (
        <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-slate-700 px-6">
                <Package className="h-7 w-7 text-indigo-400" />
                <span className="text-lg font-bold tracking-tight">InvManager</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-1">
                    {items.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(`${href}/`);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="border-t border-slate-700 px-4 py-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-600 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
