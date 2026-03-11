'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PaginatedResponse, User, UserPayload } from '@/types';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/modal';
import Badge from '@/components/badge';
import UserForm from '@/components/forms/user-form';
import TopNav from '@/components/top-nav';
import DataTable, { Column } from '@/components/data-table';
import { userService } from '@/services/user-service';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function UsersPage() {
  const [response, setResponse] = useState<PaginatedResponse<User> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await userService.list(page);
    setResponse(data);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setSelected(null); setModal('create'); };
  const openEdit = (u: User) => { setSelected(u); setModal('edit'); };
  const close = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (data: UserPayload) => {
    try {
      if (selected) {
        await userService.update(selected.id, data);
        toast.success('User updated successfully.');
      } else {
        await userService.create(data);
        toast.success('User created successfully.');
      }
      close();
      await load();
    } catch {
      toast.error(selected ? 'Failed to update user.' : 'Failed to create user.');
    }
  };

  const handleDelete = async () => {
    if (deleteUserId === null) return;
    setDeletingUserId(deleteUserId);
    try {
      await userService.remove(deleteUserId);
      toast.success('User deleted successfully.');
      setDeleteUserId(null);
      await load();
    } catch {
      toast.error('Failed to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role', header: 'Role',
      render: (u) => (
        <Badge variant={u.role === 'admin' ? 'info' : 'default'}>
          {u.role}
        </Badge>
      ),
    },
    {
      key: 'actions', header: '',
      render: (u) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteUserId(u.id)}>
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <TopNav title="User Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">{response?.total ?? 0} total users</p>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add User
          </Button>
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

      <Modal
        open={!!modal}
        onClose={close}
        title={selected ? 'Edit User' : 'Create User'}
      >
        <UserForm initial={selected ?? undefined} onSubmit={handleSubmit} onCancel={close} />
      </Modal>

      <AlertDialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingUserId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteUserId === null || deletingUserId !== null}
              onClick={() => {
                void handleDelete();
              }}
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
