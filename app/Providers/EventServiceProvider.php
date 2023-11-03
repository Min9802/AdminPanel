<?php

namespace App\Providers;

use App\Events\Admin\ActionFileEvent;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\Admin\UpdateFileEvent;
use App\Events\Admin\UploadFileEvent;
use App\Events\TestEvent;
use App\Listeners\Admin\ActionFileListener;
use App\Listeners\Admin\FileSystemListener;
use App\Listeners\Admin\UpdateListener;
use App\Listeners\Admin\UploadListener;
use Laravel\Passport\Events\AccessTokenCreated;
use App\Listeners\RevokeOldTokens;
use Laravel\Passport\Events\RefreshTokenCreated;
use App\Listeners\PruneOldTokens;
use App\Listeners\TestListener;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UploadFileEvent::class => [
            UploadListener::class
        ],
        UpdateFileEvent::class => [
            UpdateListener::class
        ],
        ActionFileEvent::class =>[
            ActionFileListener::class
        ],
        AccessTokenCreated::class=> [
            RevokeOldTokens::class
        ],

        RefreshTokenCreated::class => [
            PruneOldTokens::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        Event::listen(function(UploadFileEvent $event){
            return $event;
        });
        Event::listen(function(UpdateFileEvent $event){
            return $event;
        });
        Event::listen(function(ActionFileEvent $event){
            return $event;
        });
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
