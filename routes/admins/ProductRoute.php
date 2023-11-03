<?php

use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api', 'auth:admin', 'role:SuperAdmin'],
    'prefix' => 'product',
], function () {
    Route::get('index', [ProductController::class, 'index'])->middleware("can:product-list");
    Route::post('store', [ProductController::class, 'store'])->middleware("can:product-add");
    Route::post('update/{id}', [ProductController::class, 'update'])->middleware("can:product-edit");
    Route::patch('status/{id}', [ProductController::class, 'status'])->middleware("can:product-edit");
    Route::delete('destroy/{id}', [ProductController::class, 'destroy'])->middleware("can:product-delete");

    Route::get('trash', [ProductController::class, 'trash'])->middleware("can:product-trash");
    Route::get('restore/{id}', [ProductController::class, 'restore'])->middleware("can:product-restore");
    Route::delete('forcedelete/{id}', [ProductController::class, 'forceDelete'])->middleware("can:product-forceDelete");

});
