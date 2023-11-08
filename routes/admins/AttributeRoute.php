<?php


use App\Http\Controllers\Admin\AttributeController;

use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api', 'auth:admin', 'role:SuperAdmin'],
    'prefix' => 'attribute',
], function () {
    Route::get('/', [AttributeController::class, 'index'])->middleware("can:attribute-list");
    Route::get('get', [AttributeController::class, 'get'])->middleware("can:attribute-list");
    Route::post('store', [AttributeController::class, 'store'])->middleware("can:attribute-add");
    Route::patch('update/{id}', [AttributeController::class, 'update'])->middleware("can:attribute-edit");
    Route::patch('status/{id}', [AttributeController::class, 'status'])->middleware("can:attribute-edit");
    Route::delete('destroy/{id}', [AttributeController::class, 'destroy'])->middleware("can:attribute-delete");

    Route::get('trash', [AttributeController::class, 'trash'])->middleware("can:attribute-trash");
    Route::get('restore/{id}', [AttributeController::class, 'restore'])->middleware("can:attribute-restore");
    Route::delete('forcedelete/{id}', [AttributeController::class, 'forceDelete'])->middleware("can:attribute-forceDelete");
});
