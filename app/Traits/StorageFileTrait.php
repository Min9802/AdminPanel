<?php

namespace App\Traits;

use App\Services\StorageService;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait StorageFileTrait
{
    /**
     * get file
     */
    public function getFile($files)
    {
        $config = config('system.disk', 'local');
        $base = "https://drive.google.com/uc?export=view&id=";
        $googleDrive = Storage::disk('google');
        $fileSelects = [];
        $image = [];
        foreach ($files as $fileInfo) {
            if ($fileInfo->disk == 'local') {
                $file = Storage::disk('public')->get($fileInfo->path);
                $disk = $fileInfo->disk;
            } else {
                $file = collect($googleDrive->listContents($fileInfo->type, false))->where('path', $fileInfo->path)->first();
                $disk = $fileInfo->disk;

            }
            if (!$file) {
                $fileSelects[] = [
                    'path' => $fileInfo->path,
                    'type' => $fileInfo->type,
                    'url' => $fileInfo->path,
                ];
            } else {
                if ($disk == 'local') {
                    $path = $fileInfo->path;
                    $url = Storage::disk('public')->url($fileInfo->path);
                } else {
                    $path = $file['extra_metadata']['display_path'];
                    $url = $base . $file['extra_metadata']['id'];
                }
                $fileSelects[] = [
                    'path' => $path,
                    'type' => $fileInfo->type,
                    'disk' => $disk,
                    'url' => $url,
                ];
            }

        }
        return $fileSelects;
    }
    /**
     * upload
     * @param \Illuminate\Http\Request  $request
     * @param string $folderName
     * @param object $file
     * @return array $dataUploadTrait
     */
    public function uploadFile($folderName, $file)
    {
        $config = config('system.disk', 'local');
        switch ($config) {
            case 'local':
                try {
                    $admin = auth()->guard('admin')->user();
                    $fileNameOrigin = $file->getClientOriginalName();
                    $fileNameHash = Str::random(20) . '.' . $file->getClientOriginalExtension();
                    $filePath = Storage::disk('public')->putFileAs($admin->username . '/' . $folderName,$file, $fileNameHash);
                    $file_type = $file->getMimeType();
                    $size = $file->getSize();
                    $dataUploadTrait = [
                        'name' => $fileNameOrigin,
                        'type' => $file_type,
                        'size' => $size,
                        'folder' => $folderName,
                        'path' => $filePath,
                        'url' => url(Storage::url($filePath)),
                    ];
                    return $dataUploadTrait;
                } catch (Exception $e) {
                    Log::error('Message uploadFile local :' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }

                break;
            case 'google':
                try {
                    $fileNameOrigin = $file->getClientOriginalName();
                    $fileNameHash = Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $googleDrive = Storage::disk('google');
                    $path = $googleDrive->put($folderName, $file);
                    $this->setVisibility($path, 'public');
                    $file_type = $file->getMimeType();
                    $size = $file->getSize();
                    $dataUploadTrait = [
                        'name' => $fileNameOrigin,
                        'folder' => $folderName,
                        'type' => $file_type,
                        'size' => $size,
                        'path' => $path,
                        'url' => Storage::disk('google')->url($path),
                    ];
                    return $dataUploadTrait;

                } catch (Exception $e) {
                    Log::error('Message uploadFile google:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'nextcloud':
                try {

                    $disk = Storage::disk('nextcloud');
                    $fileNameOrigin = $file->getClientOriginalName();
                    $fileNameHash = Str::random(10) . '.' . $file->getClientOriginalExtension();

                    $path = $disk->putFileAs($folderName, $file, $fileNameOrigin);
                    dd($path);
                    $file_type = $file->getMimeType();
                    $size = $file->getSize();
                    $dataUploadTrait = [
                        'name' => $fileNameOrigin,
                        'folder' => $folderName,
                        'type' => $file_type,
                        'size' => $size,
                        'path' => $path,
                        'url' => Storage::disk('nextcloud')->publicUrl($path),
                    ];
                    return $dataUploadTrait;
                } catch (Exception $e) {
                    Log::error('Message uploadFile msv :' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 's3':
                break;
        }
    }
    public function fileUpdate($fileSelect, $file)
    {
        switch ($fileSelect->disk) {
            case 'local':
                try {
                    $fileUpdate = $this->uploadFile($fileSelect->folder, $file);
                    $this->deleteFile($fileSelect);
                    return $fileUpdate;
                } catch (Exception $e) {
                    Log::error('Message updateFile Local :' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'google':
                try {
                    $fileUpdate = $this->uploadFile($fileSelect->folder, $file);
                    $this->deleteFile($fileSelect);
                    return $fileUpdate;
                } catch (Exception $e) {
                    Log::error('Message updateFile google :' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'nextcloud':
                try {
                    $StorageMSV = Storage::disk('nextcloud');
                    $file_check = $StorageMSV->getInfo($fileSelect->path);
                    if($file_check){
                        $folder = $file_check["folder"];
                        $id = $file_check["id"];
                        return $StorageMSV->updateFile($folder, $file, $id);
                    }else{
                        return false;
                    }

                } catch (Exception $e) {
                    Log::error('Message updateFile msv:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
        }
    }
    /**
     * @param $folderName
     * @param @filepath
     */
    public function deleteFile($file)
    {
        switch ($file->disk) {
            case 'local':
                try {
                    $getFile = Storage::get($file->path);
                    if ($getFile) {
                        Storage::move($file->path, 'trash/' . $file->hash);
                    }
                } catch (Exception $e) {
                    Log::error('Message Delete local:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'google':
                try {
                    $googleDrive = Storage::disk('google');
                    $fileinfo = collect($googleDrive->listContents($file->type, false))
                        ->where('type', 'file')
                        ->where('path', $file->path)
                        ->first();
                    if ($fileinfo) {
                        return $googleDrive->delete($fileinfo['path']);
                    } else {
                        return false;
                    }
                    return true;

                } catch (Exception $e) {
                    Log::error('Message Delete google:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'msv':
                try {
                    $StorageMSV = Storage::disk('msv');
                    $file_id = $StorageMSV->get($file->path);
                    if($file_id){
                        return $StorageMSV->delete($file_id);
                    }
                    return false;

                } catch (Exception $e) {
                    Log::error('Message Delete MSV:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 's3':
                break;
        }
    }
    /**
     * restore file
     * @param object $file
     */
    public function restoreFile($file)
    {
        switch ($file->disk) {
            case 'local':
                try {

                    Storage::move('trash/' . $file->hash, 'public/' . $file->folder . '/' . $file->hash);
                    return true;
                } catch (Exception $e) {
                    Log::error('Message restore local:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'google':
                return true;

                break;
            case 'msv':
                try {
                    $StorageMSV = Storage::disk('msv');
                    $file_id = $StorageMSV->getId($file->path);
                    if($file_id){
                        $StorageMSV->restore($file_id);
                    }
                } catch (Exception $e) {
                    Log::error('Message restore msv:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
        }
    }
    /**
     * force delete file
     * @param object $file
     */
    public function forceDeleteFile($file)
    {
        switch ($file->disk) {
            case 'local':
                try {
                    $move = null;
                    $getFile = Storage::get('trash/' . $file->path);
                    if ($getFile) {
                        $move = Storage::delete('trash/' . $file->file_name);
                    }
                    return $move;
                } catch (Exception $e) {
                    Log::error('Message force delete local:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'google':
                try {
                    $googleDrive = Storage::disk('google');
                    $fileinfo = collect($googleDrive->listContents($file->type, false))
                        ->where('type', 'file')
                        ->where('path', $file->path)
                        ->first();
                    if ($fileinfo) {
                        return $googleDrive->delete($fileinfo['path']);
                    } else {
                        return false;
                    }
                    return true;

                } catch (Exception $e) {
                    Log::error('Message Delete google:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'msv':
                try {
                    $StorageMSV = Storage::disk('msv');
                    $file_id = $StorageMSV->getId($file->path);
                    if($file_id){
                        $StorageMSV->forceDelete($file_id);
                    }
                } catch (Exception $e) {
                    Log::error('Message Delete msv:' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
        }
    }
    /**
     * list file
     * @param string $folderName
     * @return array $data
     */
    public function listFileGG($folderName)
    {
        $recursive = true;
        $googleDrive = Storage::disk('google');
        $contents = collect($googleDrive->listContents($folderName, $recursive));
        return $contents;
    }
    /**
     * download file
     * @param string $folderName
     * @param string $filepaths
     * @return \Illuminate\Http\Response
     */
    public function downloadFile($folderName, $filepath)
    {

        try {
            $googleDrive = Storage::disk('google');
            $fileinfo = collect($googleDrive->listContents($folderName, false))
                ->where('type', 'file')
                ->where('path', $filepath)
                ->first();

            $contents = $googleDrive->get($fileinfo['path']);
            return response($contents)
                ->header('Content-Type', $fileinfo['mimetype'])
                ->header('Content-Disposition', "attachment; filepaths='" . $fileinfo['name'] . "'");

        } catch (Exception $e) {
            Log::error('Message donwload :' . $e->getMessage() . '--line: ' . $e->getLine());
            return false;
        }
    }
    /**
     * set permissions
     */
    public function setVisibility($folderName, $visibility)
    {
        try {
            $googleDrive = Storage::disk('google');
            $googleDrive->setVisibility($folderName, $visibility);
            return $googleDrive;

        } catch (Exception $e) {
            Log::error('Message setVisibility :' . $e->getMessage() . '--line: ' . $e->getLine());
            return false;
        }
    }
    public function addFolder($name)
    {
        $config = config('system.disk', 'local');
        switch ($config) {
            case 'local':
                try {
                    $admin = auth()->guard('admin')->user();
                    $folderpath = $admin->username . '/' . $name;
                    Storage::createDirectory($folderpath);
                    return $name;
                } catch (Exception $e) {
                    Log::error('Message create  folder local :' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
            case 'google':
                try {
                    $admin = auth()->guard('admin')->user();
                    Storage::disk('google')->createDirectory($name);
                    return $name;
                } catch (Exception $e) {
                    Log::error('Message create  folder local :' . $e->getMessage() . '--line: ' . $e->getLine());
                    return false;
                }
                break;
                break;
            case 'msv':
                Storage::disk('msv')->createDirectory($name);
                return $name;
                break;
        }
    }
}
