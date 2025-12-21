<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceCategory extends Model
{
    protected $fillable = [
        'name',
        'percentage_weight',
        'is_active',
        'display_order'
    ];

    protected $casts = [
        'percentage_weight' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get all student performances for this category
     */
    public function studentPerformances()
    {
        return $this->hasMany(StudentPerformance::class, 'category_id');
    }

    /**
     * Scope to get only active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
