<?php

namespace App\Listeners\Admin;

use App\Events\Admin\UpdateFileEvent;
use App\Models\Admin\FileSystem;
use App\Traits\StorageFileTrait;
use Illuminate\Support\Facades\Log;

class UpdateListener
{
    use StorageFileTrait;
    /**
     * Create the event listener.
     */
    private $fileSystem;
    private $file;
    public function __construct(FileSystem $fileSystem)
    {
        $this->fileSystem = $fileSystem;
    }

    /**
     * Handle the event.
     */
    public function handle(UpdateFileEvent $event): void
    {
        $file = $event->file;
        $fileselected = $event->fileselected;
        $config = config('system.disk', 'local');
        $user = auth()->guard('admin')->user();
        $fileInfo = $this->fileUpdate($fileselected, $file);

        if ($fileInfo) {
            $data = [
                'disk' => $fileselected->disk,
                'type' => $fileInfo['type'],
                'name' => $fileInfo['name'],
                'folder' => $fileInfo['folder'],
                'path' => $fileInfo['path'],
                'url' => $fileInfo['url'],
            ];
            $fileselected->update($data);
            $event->fileInfo = $fileselected;
            $event->status = true;
        } else {
            $event->status = false;
            Log::error('Message Update Listenner :' . trans('res.update.fail'));
            throw new \ErrorException(trans('res.update.fail'));
        }
    }
}
