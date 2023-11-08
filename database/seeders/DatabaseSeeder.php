<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User\User::factory(100)->create();
        $this->call([
            // AdminSeeder::class,
            RolePermissionSeeder::class,
        ]);
    }
}
