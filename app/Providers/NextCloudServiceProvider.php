<?php

namespace App\Providers;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use League\Flysystem\WebDAV\WebDAVAdapter;
use Sabre\DAV\Client;
use Illuminate\Contracts\Container\Container;

class NextCloudServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Storage::extend('nextcloud', function ($app, $config) {
            $pathPrefix = 'remote.php/dav/files/' . $config['userName'];
            if (array_key_exists('pathPrefix', $config)) {
                $pathPrefix = rtrim($config['pathPrefix'], '/') . '/' . $pathPrefix;
            }
            $client = new Client($config);
            $adapter = new WebDAVAdapter($client, $pathPrefix);
            $driver = new Filesystem($adapter,$config);
            return new FilesystemAdapter($driver, $adapter, $config);
        });

    }
}
