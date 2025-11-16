<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Officer extends Model
{
    protected $primaryKey = 'officer_id';
    
    protected $fillable = [
        'member_id',
        'position',
        'batch_id',
    ];
    
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'member_id');
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id');
    }
}
