<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Places extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'cupboard_id'];

    public function cupboard(): BelongsTo
    {
        return $this->belongsTo(Cupboards::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Items::class);
    }
}
