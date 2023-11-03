<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;

Route::group([
    'middleware' => ['api','recaptcha'],
    'prefix' => 'auth',
], function() {
    Route::post('/login', [AuthController::class, 'login']);
    Route::group([
        'middleware' => ['auth:admin'],
    ], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/info', [AuthController::class, 'info']);
    });
});
