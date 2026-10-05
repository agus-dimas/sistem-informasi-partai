<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index()
    {
        $admins = User::whereIn('role', ['admin', 'super_admin'])->orderBy('role')->orderBy('name')->get();

        return Inertia::render('dashboard/users/index', compact('admins'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $admin->role = 'admin';
        $admin->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Admin berhasil ditambahkan.']);

        return redirect()->route('dashboard.users.index');
    }

    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($user->role === 'super_admin') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Password super admin tidak dapat diubah dari halaman ini.']);

            return back();
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Password admin berhasil diperbarui.']);

        return redirect()->route('dashboard.users.index');
    }
}
