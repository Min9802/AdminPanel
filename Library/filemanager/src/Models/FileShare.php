<?php

namespace Min\FileManager\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileShare extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function file()
    {
        return $this->hasOne(FileSystem::class, 'id', 'file_id');
    }
}
