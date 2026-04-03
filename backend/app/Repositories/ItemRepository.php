<?php

namespace App\Repositories;

use App\Models\Items;
use Illuminate\Pagination\LengthAwarePaginator;

class ItemRepository extends UtilRepository
{
    public function __construct(Items $model)
    {
        parent::__construct($model);
    }

    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator
    {
        return $this->model
            ->with(['place.cupboard'])
            ->latest()
            ->paginate($perPage);
    }

    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->with(['place.cupboard'])
            ->where(function ($q) use ($query) {
                $q->where('name', 'ilike', "%{$query}%")
                    ->orWhere('code', 'ilike', "%{$query}%");
            })
            ->latest()
            ->paginate($perPage);
    }

    public function lockForUpdate(int $id): Items
    {
        return $this->model->lockForUpdate()->findOrFail($id);
    }
}
