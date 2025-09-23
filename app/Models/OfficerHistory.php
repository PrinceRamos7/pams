<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficerHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'officer_id',
        'batch_id',
        'position',
        'term_start',
        'term_end',
    ];

    // Relation to Member via Officer
    public function officer()
    {
        return $this->belongsTo(Officer::class, 'officer_id', 'officer_id');
    }

    public function member()
    {
        return $this->officer->member(); // indirect via officer
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id', 'id');
    }
}
