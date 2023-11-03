<?php

namespace App\Listeners\Admin;

use App\Events\Admin\ActionFileEvent;
use App\Models\Admin\FileSystem;
use App\Traits\StorageFileTrait;
use Illuminate\Support\Facades\Log;

class ActionFileListener
{
    use StorageFileTrait;
    /**
     * Create the event listener.
     */
    private $fileSystem;
    private $fileSelect;
    public function __construct(FileSystem $fileSystem)
    {
        $this->fileSystem = $fileSystem;
    }

    /**
     * Handle the event.
     */
    public function handle(ActionFileEvent $event): void
    {
        try {
            $action = $event->action;
            $fileSelect = $event->fileselected;
            switch ($action) {
                case "delete":
                    $deleted = $this->deleteFile($fileSelect);
                    if ($deleted) {
                        $event->status = true;
                    }
                    break;
                case "restore":
                    $restore = $this->restoreFile($fileSelect);
                    if ($restore) {
                        $event->status = true;
                    }
                    break;
                case "forceDelete":
                    $forceDelete = $this->forceDeleteFile($fileSelect);
                    if ($forceDelete) {
                        $event->status = true;
                    }
                    break;
            }
        } catch (\Exception $e) {
            Log::error('Message Action Listener :' . $e->getMessage() . '--line: ' . $e->getLine());
        }
    }
}
