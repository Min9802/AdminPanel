<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();

        $this->ApiV1();
        $this->AdminApiV1();
        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
    protected function ApiV1()
    {
        Route::prefix('api/v1/')->group(function () {
            $this->mapApiV1();
        });

    }
    public function AdminApiV1()
    {
        Route::prefix('api/v1/admin/')->group(function () {
            $this->mapAdminApiV1();
        });

    }
    protected function mapApiV1()
    {
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/apiGlobal.php'));

    }
    protected function mapAdminApiV1()
    {
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/AuthRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/StaffRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/RoleRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/PermissionRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/ProfileRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/PackageRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/ProductRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/SettingRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/FileManagerRoute.php'));
        Route::middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/admins/AttributeRoute.php'));
        Route::middleware('api')
        ->namespace($this->namespace)
        ->group(base_path('routes/admins/UserRoute.php'));

    }
    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
