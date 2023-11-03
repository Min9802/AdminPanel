<?php

use App\Http\Controllers\Admin\FileManagerController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api', 'auth:admin', 'role:SuperAdmin'],
    'prefix' => 'filemanager',
], function () {
    Route::get('disk', [FileManagerController::class, 'disk']);
    Route::group([
        'prefix' => 'file',
    ],function(){
        Route::get('index', [FileManagerController::class, 'index']);
        Route::post('stream', [FileManagerController::class, 'stream']);
        Route::post('store', [FileManagerController::class, 'store']);
        Route::post('update/{id}', [FileManagerController::class, 'update']);
        Route::patch('status/{id}', [FileManagerController::class, 'status']);
        Route::delete('destroy/{id}', [FileManagerController::class, 'destroy']);

        Route::get('trash', [FileManagerController::class, 'trash']);
        Route::get('restore/{id}', [FileManagerController::class, 'restore']);
        Route::delete('forcedelete/{id}', [FileManagerController::class, 'forceDelete']);

    });
    Route::group([
        'prefix' => 'folder',
    ],function(){
        Route::post('list', [FileManagerController::class, 'listFolder']);
        Route::post('listfile', [FileManagerController::class, 'listfile']);
        Route::post('store', [FileManagerController::class, 'addFolder']);
        Route::post('update', [FileManagerController::class, 'updateFolder']);
        Route::post('destroy', [FileManagerController::class, 'destroyFolder']);

        Route::get('trash', [FileManagerController::class, 'trashFolder']);
        Route::post('restore', [FileManagerController::class, 'restoreFolder']);
        Route::post('forcedelete', [FileManagerController::class, 'forceDeleteFolder']);

    });
});
