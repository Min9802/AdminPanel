<?php

namespace Min\Storage;

use Illuminate\Support\ServiceProvider;
use Min\Storage\Commands\StorageCommand;

class StorageProvider extends ServiceProvider
{
    public function boot()
    {
        // $this->loadViewsFrom(__DIR__.'/views', 'simple');
        // $this->loadRoutesFrom(__DIR__ . '/routes/web.php');
        // $this->loadMigrationsFrom(__DIR__.'/database/migrations');
        // $this->publishes([
        //     __DIR__ . '/config/storage.php' => config_path('storage.php'),
        // ], 'storage-config');
        if ($this->app->runningInConsole()) {
            $this->commands([
                StorageCommand::class,
            ]);
        }
        $this->publishConfig();
    }
    public function register()
    {
        //
    }
    private function publishConfig()
    {
        $this->publishes([
            __DIR__ . '/config/storage.php' => config_path('storage.php'),
        ], 'storage-config');
    }
}
