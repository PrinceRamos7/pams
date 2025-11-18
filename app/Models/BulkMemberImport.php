<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulkMemberImport extends Model
{
    use HasFactory;

    protected $fillable = [
        'imported_by',
        'total_records',
        'successful_records',
        'failed_records',
        'errors',
        'status',
    ];

    protected $casts = [
        'errors' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'imported_by');
    }
}
