<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Public/Products/Index');
});

Route::get('/product/{id}', function (int $id) {
    return Inertia::render('Public/Products/Show', [
        'id' => $id,
    ]);
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
});

Route::prefix('admin')->group(function () {
    Route::get('/products', function () {
        return Inertia::render('Admin/Products/Index');
    });

    Route::get('/products/create', function () {
        return Inertia::render('Admin/Products/Create');
    });

    Route::get('/products/{id}/edit', function (int $id) {
        return Inertia::render('Admin/Products/Edit', [
            'id' => $id,
        ]);
    });
});
