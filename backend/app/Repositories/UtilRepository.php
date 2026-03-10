<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

//use for crud
abstract class UtilRepository
{
    public function __construct(protected Model $model)
    {
    }

    //get all
    public function all(array $with = []): Collection
    {
        return $this->model->with($with)->get();
    }

    //find
    public function findOrFail(int $id, array $with = []): Model
    {
        return $this->model->with($with)->findOrFail($id);
    }

    //creat
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    //patch
    public function update(int $id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);

        return $record->fresh();
    }

    //delete
    public function delete(int $id): void
    {
        $this->findOrFail($id)->delete();
    }

    //pagination
    public function paginate(int $perPage = 15, array $with = [])
    {
        return $this->model->with($with)->latest()->paginate($perPage);
    }
}
