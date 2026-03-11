'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { BorrowPayload, Item } from '@/types';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Package } from 'lucide-react';
import { itemService } from '@/services/item-service';
import { borrowService } from '@/services/borrow-service';
import TopNav from '@/components/top-nav';
import { Button } from '@/components/ui/button';
import Badge, { itemStatusVariant } from '@/components/badge';
import BorrowForm from '@/components/forms/borrow-form';
import Modal from '@/components/modal';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    itemService.get(Number(id)).then(setItem).finally(() => setLoading(false));
  }, [id]);

  const handleBorrow = async (data: BorrowPayload) => {
    await borrowService.borrow(data);
    setModal(false);
    // Reload to show updated quantity
    const updated = await itemService.get(Number(id));
    setItem(updated);
  };

  if (loading) {
    return (
      <>
        <TopNav title="Item Details" />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <TopNav title="Item Not Found" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-slate-500">
          <Package className="h-16 w-16 opacity-30" />
          <p>Item not found.</p>
          <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
        </div>
      </>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:8000';

  return (
    <>
      <TopNav title={item.name} />
      <div className="flex-1 overflow-y-auto p-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Image */}
          <div className="flex items-start justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {item.image_path ? (
              <img
                src={`${apiBase}/storage/${item.image_path}`}
                alt={item.name}
                className="max-h-64 rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-xl bg-slate-100">
                <Package className="h-16 w-16 text-slate-300" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
                <p className="font-mono text-sm text-slate-500">{item.code}</p>
              </div>
              <Badge variant={itemStatusVariant(item.status)} className="text-sm">
                {item.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Quantity" value={String(item.quantity)} />
              <Detail label="Serial No." value={item.serial_number ?? '—'} />
              <Detail label="Location" value={item.place ? `${item.place.cupboard?.name} → ${item.place.name}` : '—'} />
              <Detail label="Last Updated" value={formatDate(item.updated_at)} />
            </div>

            {item.description && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</p>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
            )}

            {item.quantity > 0 && item.status === 'in-store' && (
              <div className="pt-2">
                <Button onClick={() => setModal(true)}>Borrow This Item</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Borrow Item" size="lg">
        <BorrowForm
          preselectedItemId={item.id}
          onSubmit={handleBorrow}
          onCancel={() => setModal(false)}
        />
      </Modal>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-slate-700">{value}</p>
    </div>
  );
}
