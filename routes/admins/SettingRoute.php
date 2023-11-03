<?php

use App\Http\Controllers\Admin\SettingController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['api', 'auth:admin', 'role:SuperAdmin'],
    'prefix' => 'setting',

], function () {
    Route::get('config', [SettingController::class, 'config'])->middleware("can:setting-list");
    Route::post('save', [SettingController::class, 'save'])->middleware("can:setting-add");
});
