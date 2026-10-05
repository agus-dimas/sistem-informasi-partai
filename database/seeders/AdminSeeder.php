<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin Account
        $superAdmin = User::firstOrNew(['email' => 'superadmin@example.com']);
        $superAdmin->name = 'Super Admin';
        $superAdmin->password = Hash::make('password123');
        $superAdmin->role = 'super_admin';
        $superAdmin->save();

        // 2. Admin Account
        $admin = User::firstOrNew(['email' => 'admin@example.com']);
        $admin->name = 'Admin Utama';
        $admin->password = Hash::make('password123');
        $admin->role = 'admin';
        $admin->save();
    }
}
