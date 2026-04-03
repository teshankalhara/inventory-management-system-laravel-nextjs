<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private readonly UserRepository     $repo,
        private readonly ActivityLogService $logger
    ) {}

    public function paginate(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);

        $user = $this->repo->create($data);

        $this->logger->log('user.created', 'User', $user->id, null, [
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ]);

        return $user;
    }

    public function update(int $id, array $data): User
    {
        $old  = $this->repo->findOrFail($id);
        $snap = $old->only(['name', 'email', 'role']);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user = $this->repo->update($id, $data);

        $this->logger->log('user.updated', 'User', $id, $snap, $user->only(['name', 'email', 'role']));

        return $user;
    }

    public function delete(int $id): void
    {
        $user = $this->repo->findOrFail($id);

        $this->logger->log('user.deleted', 'User', $id, $user->only(['name', 'email', 'role']));

        $this->repo->delete($id);
    }
}
