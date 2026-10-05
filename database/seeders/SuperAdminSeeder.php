<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = 'dpp@partaigaruda.org';

        $user = User::firstOrNew(['email' => $email]);
        if (!$user->exists) {
            $user->name = 'Super Admin';
            $user->password = Hash::make('password123');
        }
        $user->role = 'super_admin';
        $user->save();
    }
}
