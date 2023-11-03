<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PermissionController;

Route::group([
    'middleware' => ['api','auth:admin','role:SuperAdmin','can:permission'],
    'prefix' => 'permission'
], function () {
    Route::controller(PermissionController::class)->group(function () {
        Route::get('/', 'index')->middleware("can:permission-list");
        Route::post('store', 'store')->middleware("can:permission-add");
        Route::patch('update/{id}', 'update')->middleware("can:permission-edit");
        Route::delete('destroy/{id}', 'destroy')->middleware("can:permission-delete");
    });
});
