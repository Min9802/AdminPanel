<?php

use App\Http\Controllers\Admin\StaffController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api','auth:admin','role:SuperAdmin','can:staff'],
    'prefix' => 'staff',

], function () {

    Route::controller(StaffController::class)->group(function () {
        Route::get('/', 'index')->middleware("can:staff-list");
        Route::post('store', 'store')->middleware("can:staff-add");
        Route::patch('update/{id}', 'update')->middleware("can:staff-edit");
        Route::patch('status/{id}', 'status')->middleware("can:staff-edit");
        Route::delete('destroy/{id}', 'destroy')->middleware("can:staff-delete");

        Route::get('trash', 'trash')->middleware("can:staff-trash");
        Route::get('restore/{id}', 'restore')->middleware("can:staff-restore");
        Route::delete('forcedelete/{id}', 'forceDelete')->middleware("can:staff-forceDelete");
    });
});
