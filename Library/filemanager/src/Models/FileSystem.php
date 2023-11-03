<?php

namespace Min\FileManager\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class FileSystem extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded=[];

    public function shares()
    {
        return $this->hasMany(FileShare::class, 'file_id','id');
    }
}
