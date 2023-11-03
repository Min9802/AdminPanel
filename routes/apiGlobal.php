<?php

use App\Http\Controllers\Admin\FileManagerController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TwoFactoryAuthController;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */
Route::group([
    "middleware" => ["api", 'auth'],
    "prefix" => "two_face"
], function () {
    Route::get("/", [TwoFactoryAuthController::class,'getQR']);
    Route::post("/enable", [TwoFactoryAuthController::class,'enable'])->middleware('2fa');
    Route::post("/disable", [TwoFactoryAuthController::class,'disable']);
    Route::post("/verify", [TwoFactoryAuthController::class, 'verify'])->middleware('2fa');
    Route::get("/getotp", [TwoFactoryAuthController::class, 'getotp']);
    Route::post("/otpverify", [TwoFactoryAuthController::class, 'otpverify']);

});

Route::group([
    "middleware" => ["api"],
    "prefix" => "file",
], function () {
    Route::post("getfile", [FileManagerController::class, 'filesystem']);
});
Route::group([
    "middleware" => ["api"],
    "prefix" => "setting",
], function () {
    Route::get("system", [SettingController::class, 'config']);
    Route::get('setLocale/{locale}', function ($locale) {
        if (in_array($locale, Config::get('app.locales'))) {
            Session::put('locale', $locale);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'set locale successfully',
        ]);
    })->name('app.setLocale');

});

Route::post("/test", [TestController::class, 'test']);


