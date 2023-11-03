<?php

namespace App\Listeners\Admin;

use App\Events\Admin\UploadFileEvent;
use App\Models\Admin\FileSystem;
use App\Traits\StorageFileTrait;
use Illuminate\Support\Facades\Log;

class UploadListener
{
    use StorageFileTrait;

    /**
     * Create the event listener.
     */
    private $fileSystem;
    public function __construct(FileSystem $fileSystem)
    {
        $this->fileSystem = $fileSystem;
    }

    /**
     * Handle the event.
     */
    public function handle(UploadFileEvent $event)
    {
        $folder = $event->folder;
        $file = $event->file;
        $config = config('system.disk', 'local');
        $extension = $file->extension();
        $imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'svg', 'svgz', 'cgm', 'djv', 'djvu', 'ico', 'ief', 'jpe', 'pbm', 'pgm', 'pnm', 'ppm', 'ras', 'rgb', 'tif', 'tiff', 'wbmp', 'xbm', 'xpm', 'xwd'];
        $videoExtensions = ["webm", "mp4", "ogv","mov"];
        $audioExtensions = ['mp3'];
        if (empty($folder)) {
            if (collect($imageExtensions)->contains($extension)) {
                $folderUpload = 'image';
            }
            if (collect($videoExtensions)->contains($extension)) {
                $folderUpload = "video";
            }
            if (collect($audioExtensions)->contains($extension)) {
                $folderUpload = 'audio';
            }
        } else {
            $folderUpload = $folder;
        }


        $fileInfo = $this->uploadFile($folderUpload, $file);

        if ($fileInfo) {
            $fileupload = $this->fileSystem->create([
                'disk' => $config,
                'name' => $fileInfo['name'],
                'type' => $fileInfo['type'],
                'size' => $fileInfo['size'],
                'folder' => $fileInfo['folder'],
                'path' => $fileInfo['path'],
                'url' => $fileInfo['url'],
            ]);
            $event->fileInfo = $fileupload;
            $event->status = true;
        } else {
            $event->status = false;
            Log::error('Message upload Listenner :' . trans('res.upload.fail'));
            throw new \ErrorException(trans('res.upload.fail'));
        }
    }
}
