<?php

use App\Http\Controllers\Admin\ProfileController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api','auth:admin'],
], function () {
    Route::group(['prefix' => 'profile'], function () {
        Route::get('/show', [ProfileController::class, 'show']);
        Route::patch('/update', [ProfileController::class, 'update']);
        Route::post('/changepass', [ProfileController::class, 'changepass']);
        Route::get('/getqrcode', [ProfileController::class, 'getqrcode']);

    });
});


