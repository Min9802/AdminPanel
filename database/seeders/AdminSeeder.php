<?php

namespace Database\Seeders;

use App\Models\Admin\Admin;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $table = new Admin;
        $table->truncate();
        $data = [
            'username' => "Admin",
            'name' => "Admin",
            'email' => "Admin@gmail.com",
            'password' => Hash::make('Admin'),
        ];
        $table->create($data);
    }
}
