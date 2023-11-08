<?php

namespace Database\Seeders;

use App\Models\Admin\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        $roleModel = new Role();
        $roleModel->truncate();
        $permissionModel = new Permission();
        $permissionModel->truncate();

        //role
        $roles = [
            "SuperAdmin",
        ];
        foreach ($roles as $role) {
            Role::create([
                'name' => $role,
            ]);
        }

        //permissions

        $permissions = [
            'permission',
            'role',
            'staff',
            'setting',
            'package',
            'product',
        ];
        $actions = [
            'list',
            'add',
            'edit',
            'delete',
            'trash',
            'restore',
            'forceDelete',
        ];
        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission,
            ]);
            Role::find(1)->givePermissionTo($permission);
            foreach ($actions as $action) {
                $permissionMerge = $permission . '-' . $action;
                Permission::create([
                    'name' => $permissionMerge,
                ]);
                Role::find(1)->givePermissionTo($permissionMerge);

            }
        }

        Admin::find(1)->assignRole($roles);
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
