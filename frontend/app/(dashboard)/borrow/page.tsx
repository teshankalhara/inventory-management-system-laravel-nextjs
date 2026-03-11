'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BorrowPayload } from '@/types';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { borrowService } from '@/services/borrow-service';
import TopNav from '@/components/top-nav';
import { Button } from '@/components/ui/button';
import BorrowForm from '@/components/forms/borrow-form';

export default function BorrowPage() {
  const router  = useRouter();
  const [modal, setModal]     = useState(true);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: BorrowPayload) => {
    await borrowService.borrow(data);
    setModal(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <>
        <TopNav title="Borrow Item" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Borrow Recorded!</h2>
          <p className="text-sm text-slate-500">The item has been checked out successfully.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => { setSuccess(false); setModal(true); }}>
              Borrow Another
            </Button>
            <Button onClick={() => router.push('/borrow-records')}>View Borrow Records</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav title="Borrow Item" />
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">New Borrow Request</h2>
          </div>
          <BorrowForm onSubmit={handleSubmit} onCancel={() => router.back()} />
        </div>
      </div>
    </>
  );
}
