<?php

namespace App\Listeners\Admin;

use App\Events\Admin\FileSystemEvent;
use App\Models\Admin\fileSystem;
use App\Traits\StorageFileTrait;

class FileSystemListener
{
    use StorageFileTrait;
    /**
     * Create the event listener.
     *
     * @return void
     */
    private $fileSystem;
    private $file_uploaded;
    public function __construct(FileSystem $fileSystem)
    {
        $this->fileSystem = $fileSystem;
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(FileSystemEvent $event)
    {
        $folder = $event->folder;
        $files = $event->files;
        $action = $event->action;
        $user = auth()->guard('admin')->user();
        $config = config('system.disk', 'local');
        switch ($action) {
            case "upload":
                foreach ($files as $file) {
                    $extension = $file->extension();
                    $imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'svg', 'svgz', 'cgm', 'djv', 'djvu', 'ico', 'ief', 'jpe', 'pbm', 'pgm', 'pnm', 'ppm', 'ras', 'rgb', 'tif', 'tiff', 'wbmp', 'xbm', 'xpm', 'xwd'];
                    $videoExtensions = ["webm", "mp4", "ogv"];
                    $audioExtensions = ['mp3'];
                    if (empty($folder)) {
                        if (collect($imageExtensions)->contains($extension)) {
                            $type = 'image/';
                            $folderUpload = $user->username. '/image';
                        }
                        if (collect($videoExtensions)->contains($extension)) {
                            $type = 'video/';
                            $folderUpload = $user->username. "/video";
                        }
                        if (collect($audioExtensions)->contains($extension)) {
                           $type = 'audio/';
                           $folderUpload = $user->username . '/audio';
                        }
                    }else{
                        $folderUpload = $user->username. '/'.$folder;
                        if (collect($imageExtensions)->contains($extension)) {
                            $type = 'image/';
                        }
                        if (collect($videoExtensions)->contains($extension)) {
                            $type = 'video/';
                        }
                        if (collect($audioExtensions)->contains($extension)) {
                           $type = 'audio/';
                        }
                    }

                    $fileInfo = $this->uploadFile($folderUpload, $type, $file);

                    $image = [
                        'name' => $fileInfo['name'],
                        'type' => $fileInfo['type'],
                        'folder' => $fileInfo['folder'],
                        'path' => $fileInfo['path'],
                        'url' => $fileInfo['url'],
                    ];
                    $fileupload = $this->fileSystem->create([
                        'disk' => $config,
                        'name' => $image['name'],
                        'type' => $image['type'],
                        'folder' => $fileInfo['folder'],
                        'path' => $image['path'],
                        'url' => $image['url'],
                    ]);
                    $this->file_uploaded[] = $fileupload;
                }
                return $this->file_uploaded;
                break;
            case 'update':
                $fileSelect = $this->fileSystem->find($event->fileselected);
                $fileInfo = $this->fileUpdate($fileSelect[0], $files[0]);
                if ($fileInfo) {
                    $data = [
                        'disk' => $fileSelect[0]->disk,
                        'type' => $fileSelect[0]->type,
                        'name' => $fileInfo['name'],
                        'folder' => $fileInfo['folder'],
                        'path' => $fileInfo['path'],
                        'url' => $fileInfo['url'],
                    ];
                    $fileSelect[0]->update($data);
                    return true;
                } else {
                    throw new \ErrorException('res.update.fail');
                }

                break;
            case "delete":
                foreach ($files as $file) {
                    $deleted = $this->deleteFile($file);
                    $file->delete();
                }
                return true;
                break;
            case "restore":
                foreach ($files as $file) {
                    $deleted = $this->restoreFile($file);
                }
                break;
            case "forceDelete":
                foreach ($files as $file) {
                    $deleted = $this->forceDeleteFile($file);
                }
                break;
        }

    }

}
