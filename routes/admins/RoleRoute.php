<?php

use App\Http\Controllers\Admin\RoleController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api','auth:admin', 'role:SuperAdmin', 'can:role'],
    'prefix' => 'role',
], function () {
    Route::controller(RoleController::class)->group(function(){
        Route::get('/', 'index')->middleware("can:role-list");
        Route::post('store', 'store')->middleware("can:role-add");
        Route::patch('update/{id}', 'update')->middleware("can:role-edit");
        Route::delete('destroy/{id}', 'destroy')->middleware("can:role-delete");
    });
});
