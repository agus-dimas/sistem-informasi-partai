<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ConsultationController;
use Inertia\Inertia;


// =======================
// Halaman home (Public)
// =======================
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/struktur', function () {
    return Inertia::render('struktur');
})->name('struktur');

Route::get('/media', function () {
    return Inertia::render('media/index');
})->name('media.index');

Route::get('/about', function () {
    return Inertia::render('about/index');
})->name('about.index');

// =======================
// ROUTE PUBLIC BERITA
// =======================
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{id}', [NewsController::class, 'show'])->name('news.show');
Route::get('/api/news', [NewsController::class, 'apiIndex']);
Route::get('/api/news/categories', [NewsController::class, 'apiCategories']);
Route::get('/api/settings', [App\Http\Controllers\AdminCustomizeController::class, 'apiIndex']);

// =======================
// ROUTE PUBLIC KONSULTASI
// =======================
Route::get('/konsultasi', [ConsultationController::class, 'create'])->name('consultations.create');
Route::post('/konsultasi', [ConsultationController::class, 'store'])
    ->middleware('auth')
    ->name('consultations.store');



// =======================
// ROUTE UNTUK USER LOGIN
// =======================
Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', \App\Http\Controllers\DashboardController::class)->name('dashboard');

    // List konsultasi untuk admin
    Route::get('/dashboard/konsultasi', [ConsultationController::class, 'index'])
        ->middleware('admin')
        ->name('consultations.index');
    Route::post('/dashboard/konsultasi/{consultation}/response', [ConsultationController::class, 'respond'])
        ->middleware('admin')
        ->name('consultations.respond');


    // Form input & edit berita
    Route::get('/dashboard/news/create', [NewsController::class, 'create'])->middleware('admin')->name('news.create');
    Route::post('/dashboard/news', [NewsController::class, 'store'])->middleware('admin')->name('news.store');
    Route::get('/dashboard/news/{id}/edit', [NewsController::class, 'edit'])->middleware('admin')->name('news.edit');
    Route::put('/dashboard/news/{id}', [NewsController::class, 'update'])->middleware('admin')->name('news.update');

    // Hapus berita
    Route::delete('/dashboard/news/{id}', [NewsController::class, 'destroy'])->middleware('admin')->name('news.destroy');

    // Manajemen admin & Customize (super admin saja)
    Route::get('/dashboard/users', [App\Http\Controllers\AdminUserController::class, 'index'])
        ->middleware('super-admin')
        ->name('dashboard.users.index');
    Route::post('/dashboard/users', [App\Http\Controllers\AdminUserController::class, 'store'])
        ->middleware('super-admin')
        ->name('dashboard.users.store');
    Route::patch('/dashboard/users/{user}/password', [App\Http\Controllers\AdminUserController::class, 'resetPassword'])
        ->middleware('super-admin')
        ->name('dashboard.users.password');
    Route::get('/dashboard/customize', [App\Http\Controllers\AdminCustomizeController::class, 'index'])
        ->middleware('super-admin')
        ->name('dashboard.customize.index');
    Route::post('/dashboard/customize', [App\Http\Controllers\AdminCustomizeController::class, 'update'])
        ->middleware('super-admin')
        ->name('dashboard.customize.update');

    Route::get('/dashboard/customize/about', [App\Http\Controllers\AdminCustomizeController::class, 'about'])
        ->middleware('super-admin')
        ->name('dashboard.customize.about');
    Route::post('/dashboard/customize/about', [App\Http\Controllers\AdminCustomizeController::class, 'updateAbout'])
        ->middleware('super-admin')
        ->name('dashboard.customize.updateAbout');

    Route::get('/dashboard/customize/struktur', [App\Http\Controllers\AdminCustomizeController::class, 'struktur'])
        ->middleware('super-admin')
        ->name('dashboard.customize.struktur');
    Route::post('/dashboard/customize/struktur', [App\Http\Controllers\AdminCustomizeController::class, 'updateStruktur'])
        ->middleware('super-admin')
        ->name('dashboard.customize.updateStruktur');

    Route::get('/dashboard/customize/media', [App\Http\Controllers\AdminCustomizeController::class, 'media'])
        ->middleware('super-admin')
        ->name('dashboard.customize.media');
    Route::post('/dashboard/customize/media', [App\Http\Controllers\AdminCustomizeController::class, 'updateMedia'])
        ->middleware('super-admin')
        ->name('dashboard.customize.updateMedia');

    // Berita Actions (Like & Comment)
    Route::post('/news/{id}/like', [NewsController::class, 'toggleLike'])->name('news.like');
    Route::post('/news/{id}/comments', [\App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
    Route::delete('/comments/{id}', [\App\Http\Controllers\CommentController::class, 'destroy'])->name('comments.destroy');
});


require __DIR__ . '/settings.php';
