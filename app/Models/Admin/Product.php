<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Min\FileManager\Models\FileSystem;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'display_name',
        'status',
    ];
    public function Packages()
    {
        return $this->belongsToMany(Package::class,'package_products','product_id','package_id');
    }
    public function Details()
    {
        return $this->hasOne(ProductDetail::class,'product_id','id');
    }
    public function images()
    {
        return $this->belongsToMany(FileSystem::class,'product_images','product_id','image_id');
    }
    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class,'product_id','id');
    }
}
