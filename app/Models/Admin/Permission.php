<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission as PermissionModel;
use Illuminate\Database\Eloquent\SoftDeletes;
class Permission extends PermissionModel
{
    use SoftDeletes;
}
