<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Officer extends Model
{
    protected $table = 'officers';
    protected $primaryKey = 'officer_id';
    protected $fillable = [
        'position',
        'member_id',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'member_id');
    }
}
