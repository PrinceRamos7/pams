<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'year',
        'term',
    ];

    /**
     * Get the officers for this batch
     */
    public function officers()
    {
        return $this->hasMany(Officer::class, 'batch_id');
    }

    /**
     * Get the officer history records for this batch
     */
    public function officerHistory()
    {
        return $this->hasMany(OfficerHistory::class, 'batch_id');
    }
}
