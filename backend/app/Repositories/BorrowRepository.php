<?php

namespace App\Repositories;

use App\Models\Borrows;
use Illuminate\Pagination\LengthAwarePaginator;

class BorrowRepository extends UtilRepository
{
    public function __construct(Borrows $model)
    {
        parent::__construct($model);
    }

    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator
    {
        return $this->model->with(['item', 'creator'])
        ->orderByDesc('created_at')->paginate($perPage);
    }


    public function markOverdue(): void
    {
        $this->model->where('status', Borrows::STATUS_BORROWED)
            ->where('expected_return_date', '<', now()->toDateString())
            ->update(['status' => Borrows::STATUS_OVERDUE]);
    }
}
