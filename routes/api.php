<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;

Route::get('/categories', [CategoryController::class, 'index']);
Route::apiResource('products', ProductController::class);
