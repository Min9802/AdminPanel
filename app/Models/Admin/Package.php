<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Package extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded=[];
    public function Products()
    {
        return $this->belongsToMany(Product::class,'package_products','package_id','product_id');
    }
}
