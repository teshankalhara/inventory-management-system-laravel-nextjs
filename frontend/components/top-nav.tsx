'use client';

import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { getUser } from '@/lib/auth';
import type { User as UserType } from '@/types';

interface Props {
  title: string;
}

export default function TopNav({ title }: Props) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
          <User className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{user?.name ?? 'User'}</span>
          <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium capitalize text-indigo-700">
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
}
