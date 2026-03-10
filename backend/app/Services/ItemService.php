<?php

namespace App\Services;

use App\Models\Items;
use App\Repositories\ItemRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ItemService
{
    public function __construct(
        private readonly ItemRepository     $repo,
        private readonly ActivityLogService $logger
    ) {}

    public function paginate(int $perPage = 15, ?string $search = null)
    {
        return $search
            ? $this->repo->search($search, $perPage)
            : $this->repo->paginate($perPage);
    }

    public function findOrFail(int $id): Items
    {
        return $this->repo->findOrFail($id, ['place.cupboard']);
    }

    public function create(array $data, ?UploadedFile $image = null): Items
    {
        if ($image) {
            $data['image_path'] = $image->store('items', 'public');
        }

        $item = $this->repo->create($data);

        $this->logger->log('item.created', 'Item', $item->id, null, $item->toArray());

        return $item->load('place.cupboard');
    }

    public function update(int $id, array $data, ?UploadedFile $image = null): Items
    {
        $old = $this->repo->findOrFail($id);
        $snap = $old->toArray();

        if ($image) {
            if ($old->image_path) {
                Storage::disk('public')->delete($old->image_path);
            }
            $data['image_path'] = $image->store('items', 'public');
        }

        $item = $this->repo->update($id, $data);

        $this->logger->log('item.updated', 'Item', $id, $snap, $item->toArray());

        return $item->load('place.cupboard');
    }

    public function delete(int $id): void
    {
        $item = $this->repo->findOrFail($id);

        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }

        $this->logger->log('item.deleted', 'Item', $id, $item->toArray());

        $this->repo->delete($id);
    }
}
