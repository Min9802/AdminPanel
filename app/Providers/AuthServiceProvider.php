<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Carbon;
use Laravel\Passport\AuthCode;
use Laravel\Passport\Client;
use Laravel\Passport\Passport;
use Laravel\Passport\PersonalAccessClient;
use Laravel\Passport\Token;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // config(['auth.defaults.guard' => 'api']);

        Passport::enableImplicitGrant();
        Passport::useTokenModel(Token::class);
        Passport::useClientModel(Client::class);
        Passport::useAuthCodeModel(AuthCode::class);
        Passport::usePersonalAccessClientModel(PersonalAccessClient::class);
        Passport::withoutCookieSerialization();

        Passport::tokensExpireIn(Carbon::now()->addDay(1));

        Passport::refreshTokensExpireIn(Carbon::now()->addMonth(1));

        Passport::personalAccessTokensExpireIn(Carbon::now()->addDay(1));

        Passport::ignoreCsrfToken(true);
    }
}
