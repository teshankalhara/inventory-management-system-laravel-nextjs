<?php

namespace App\Services;

use App\Models\Borrow;
use App\Models\Borrows;
use App\Repositories\BorrowRepository;
use App\Repositories\ItemRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BorrowService
{
    public function __construct(
        private readonly BorrowRepository   $borrowRepo,
        private readonly ItemRepository     $itemRepo,
        private readonly ActivityLogService $logger
    ) {}

    public function paginate(int $perPage = 15)
    {
        $this->borrowRepo->markOverdue();

        return $this->borrowRepo->paginate($perPage);
    }

    public function borrow(array $data): Borrows
    {
        return DB::transaction(function () use ($data) {
            $item = $this->itemRepo->lockForUpdate($data['item_id']);

            if ($item->quantity < $data['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => [
                        "Insufficient stock. Available: {$item->quantity}, Requested: {$data['quantity']}."
                    ],
                ]);
            }

            $oldQuantity = $item->quantity;

            $item->decrement('quantity', $data['quantity']);
            $item->refresh();
            $item->recalculateStatus();
            $item->save();

            $borrow = Borrows::create([
                ...$data,
                'status'     => Borrows::STATUS_BORROWED,
                'created_by' => Auth::id(),
            ]);

            $this->logger->log('borrow.created', 'Borrow', $borrow->id, null, [
                'item_id'   => $item->id,
                'item_name' => $item->name,
                'quantity'  => $data['quantity'],
            ]);

            $this->logger->log('item.quantity_changed', 'Item', $item->id, [
                'quantity' => $oldQuantity,
            ], [
                'quantity' => $item->quantity,
            ]);

            return $borrow->load(['item', 'creator']);
        });
    }

    public function returnItem(int $borrowId): Borrows
    {
        return DB::transaction(function () use ($borrowId) {

            $borrow = $this->borrowRepo->findOrFail($borrowId);

            if ($borrow->status === Borrows::STATUS_RETURNED) {
                throw ValidationException::withMessages([
                    'borrow_id' => ['This item has already been returned.'],
                ]);
            }

            $item = $this->itemRepo->lockForUpdate($borrow->item_id);

            $oldQuantity = $item->quantity;

            $item->increment('quantity', $borrow->quantity);
            $item->refresh();
            $item->recalculateStatus();
            $item->save();

            $borrow->update([
                'status'        => Borrows::STATUS_RETURNED,
                'returned_date' => now()->toDateString(),
            ]);

            $this->logger->log('borrow.returned', 'Borrow', $borrow->id, [
                'status' => 'borrowed',
            ], [
                'status'        => 'returned',
                'returned_date' => $borrow->returned_date,
            ]);

            $this->logger->log('item.quantity_changed', 'Item', $item->id, [
                'quantity' => $oldQuantity,
            ], [
                'quantity' => $item->quantity,
            ]);

            return $borrow->load(['item', 'creator']);
        });
    }
}
