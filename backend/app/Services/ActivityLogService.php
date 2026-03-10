<?php

namespace App\Services;

use App\Models\ActivityLogs;
use Illuminate\Support\Facades\Auth;


class ActivityLogService
{
    public function log(
        string $action,
        string $entityType,
        int $entityId,
        ?array $oldValue = null,
        ?array $newValue = null
    ): ActivityLogs {
        return ActivityLogs::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_value' => $oldValue,
            'new_value' => $newValue,
        ]);
    }

    public function paginate(int $perPage = 20)
    {
        return ActivityLogs::with('user')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}
