<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentPerformance extends Model
{
    protected $fillable = [
        'member_id',
        'category_id',
        'score',
        'remarks'
    ];

    protected $casts = [
        'score' => 'decimal:2',
    ];

    /**
     * Get the member that owns the performance
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the category that owns the performance
     */
    public function category()
    {
        return $this->belongsTo(PerformanceCategory::class);
    }

    /**
     * Calculate weighted score
     */
    public function getWeightedScoreAttribute()
    {
        return ($this->score * $this->category->percentage_weight) / 100;
    }
}
