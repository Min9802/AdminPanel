<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api', 'auth:admin'],
    'prefix' => 'user',

], function () {
    Route::get('/', [UserController::class, 'index'])->middleware("can:user-list");
    // Route::post('store', [UserController::class, 'store'])->middleware("can:staff-add");
    // Route::patch('update/{id}', [UserController::class, 'update'])->middleware("can:staff-edit");
    // Route::delete('destroy/{id}', [UserController::class, 'destroy'])->middleware("can:staff-delete");

    // Route::get('trash', [UserController::class, 'trash'])->middleware("can:product-trash");
    // Route::get('restore/{id}', [UserController::class, 'restore'])->middleware("can:product-restore");
    // Route::delete('forcedelete/{id}', [UserController::class, 'forceDelete'])->middleware("can:product-forceDelete");
});
