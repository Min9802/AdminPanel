<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as RoleModel;
use Illuminate\Database\Eloquent\SoftDeletes;
class Role extends RoleModel
{
    use SoftDeletes;
}
