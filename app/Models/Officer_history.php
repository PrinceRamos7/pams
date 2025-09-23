<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficerHistory extends Model
{
    protected $table = 'officer_history'; // table name
    protected $fillable = [
        'officer_id',
        'term_start',
        'term_end',
    ];

    public function officer()
    {
        return $this->belongsTo(Officer::class, 'officer_id', 'officer_id');
    }
}
