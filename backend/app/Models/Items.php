<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Items extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'quantity',
        'serial_number',
        'description',
        'image_path',
        'place_id',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    // Status constants for type safety across the codebase
    const STATUS_IN_STORE = 'in-store';
    const STATUS_BORROWED = 'borrowed';
    const STATUS_DAMAGED  = 'damaged';
    const STATUS_MISSING  = 'missing';

    public function place(): BelongsTo
    {
        return $this->belongsTo(Places::class);
    }

    public function borrows(): HasMany
    {
        return $this->hasMany(Borrows::class);
    }

    public function activeBorrows(): HasMany
    {
        return $this->hasMany(Borrows::class)->where('status', 'borrowed');
    }

    //  status  qty when all itms  borrow
    public function recalculateStatus(): void
    {
        if ($this->status === self::STATUS_DAMAGED || $this->status === self::STATUS_MISSING) {
            return; // Dont auto set damage/missing flag
        }

        $this->status = $this->quantity === 0 ? self::STATUS_BORROWED : self::STATUS_IN_STORE;
    }
}
