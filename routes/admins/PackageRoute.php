<?php

use App\Http\Controllers\Admin\PackageController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api', 'auth:admin', 'role:SuperAdmin','can:package'],
    'prefix' => 'package',
], function () {
    Route::controller(PackageController::class)->group(function () {
        Route::get('/', 'index')->middleware("can:package-list");
        Route::post('store', 'store')->middleware("can:package-add");
        Route::patch('update/{id}', 'update')->middleware("can:package-edit");
        Route::patch('status/{id}', 'status')->middleware("can:package-edit");
        Route::delete('destroy/{id}', 'destroy')->middleware("can:package-delete");

        Route::get('trash', 'trash')->middleware("can:package-trash");
        Route::get('restore/{id}', 'restore')->middleware("can:package-restore");
        Route::delete('forcedelete/{id}', 'forceDelete')->middleware("can:package-forceDelete");
    });
});
