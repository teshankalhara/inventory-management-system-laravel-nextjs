<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Borrows extends Model
{
    use HasFactory;

    public $timestamps = false; // We manage created_at manually

    protected $fillable = [
        'item_id',
        'borrower_name',
        'borrower_contact',
        'quantity',
        'borrow_date',
        'expected_return_date',
        'returned_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'expected_return_date' => 'date',
        'returned_date' => 'date',
        'quantity' => 'integer',
    ];

    const STATUS_BORROWED = 'borrowed';
    const STATUS_RETURNED = 'returned';
    const STATUS_OVERDUE = 'overdue';

    public function item(): BelongsTo
    {
        return $this->belongsTo(Items::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isOverdue(): bool
    {
        return $this->status === self::STATUS_BORROWED
            && $this->expected_return_date->isPast();
    }
}
