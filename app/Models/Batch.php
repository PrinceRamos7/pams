<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'year',
        'term',
    ];

    // Relationship: A batch has many officer histories
    public function officerHistories()
    {
        return $this->hasMany(OfficerHistory::class);
    }
}
