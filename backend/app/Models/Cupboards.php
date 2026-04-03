<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cupboards extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'location'];

    public function places(): HasMany
    {
        return $this->hasMany(Places::class, 'cupboard_id');
    }

    // Convenience: all items stored anywhere in this cupboard
    public function items()
    {
        return $this->hasManyThrough(
            Items::class,
            Places::class,
            'cupboard_id',
            'place_id',
            'id',
            'id'
        );
    }
}
