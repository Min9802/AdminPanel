# StorageClient
StorageClient for Min/Storage
## Require 
- PHP 8.*+
- Composer
- Laravel

## Install 
- install package composer
```
composer require Min/StorageClient
```
## Publish Config
```
php artisan vendor:publish --tag=config
```
## Config ENV
```
STORAGE_SERVICE_CLIENT_URI=http://localhost:8001
STORAGE_SERVICE_CLIENT_ID=978b4967-7174-4d89-a7ad-bc288a63099b
STORAGE_SERVICE_CLIENT_SECRET=wtW2i7lb8U5QZSBWdGnO65clXiib7bZAAW8tCyib
```
## Config file
- add disk config filesystem
```
'msv' => [
            'driver' => 'msv',
            'uri' => env('STORAGE_SERVICE_CLIENT_URI'),
            'clientId' => env('STORAGE_SERVICE_CLIENT_ID'),
            'clientSecret' => env('STORAGE_SERVICE_CLIENT_SECRET'),
            'scope' => 'storage',
        ],
```
- client config
```
return [
    'token' => '/api/oauth/token',
    'option' => [
        'file' => [
            'list' => '/api/storage/client/file/list/',
            'get' => '/api/storage/client/file/get/',
            'upload' => '/api/storage/client/file/upload/',
            'update' => '/api/storage/client/file/update/',
            'delete' => '/api/storage/client/file/delete/',
            'forcedelete' => '/api/storage/client/file/forcedelete/',
        ],
        'trash' => [
            'list' => '/api/storage/client/trash/list/',
            'delete' => '/api/storage/client/trash/delete/',
            'clear' => '/api/storage/client/trash/clear/',
            'restore' => '/api/storage/client/trash/restore/',
        ],
        'folder' => [
            'list' => '/api/storage/client/folder/list/',
            'create' => '/api/storage/client/folder/create/',
            'delete' => '/api/storage/client/folder/delete/',
            'rename' => '/api/storage/client/folder/rename/',
        ],
    ],
    'client' => [
        'uri' => config('system.msv_client', env('STORAGE_SERVICE_CLIENT_URI')),
        'client_id' => config('system.msv_client_id', env('STORAGE_SERVICE_CLIENT_ID')),
        'client_secret' => config('system.msv_client_secret', env('STORAGE_SERVICE_CLIENT_SECRET')),
    ],
];
```
## Register Provider 
- add provider in ./config/app.php
```
Min\StorageClient\Providers\StorageProvider::class,
```
## Use with Illuminate\Support\Facades\Storage
- put 
```
public function store(Request $request)
{
    $file = $request->file('file');
    $folder = $request->folder;
    $StorageMSV = Storage::disk('msv');

    $path = $StorageMSV->put($path, $file); //return path
    $url = $StorageMSV->url($path); //return url
}
```
- get file info
```
    $filepath = "image/file.jpg";
    $StorageMSV = Storage::disk('msv');
    
    $fileInfo = $StorageMSV->getdata($filepath);
    
```
- delete
```
$filepath = "image/file.jpg";
$StorageMSV = Storage::disk('msv');

$file_id = $StorageMSV->getId($filepath);
return $StorageMSV->delete($file_id);
```
- restore
```
$filepath = "image/file.jpg";
$StorageMSV = Storage::disk('msv');

$file_id = $StorageMSV->getId($filepath);
return $StorageMSV->restore($file_id);
```
- force Delete
```
$filepath = "image/file.jpg";
$StorageMSV = Storage::disk('msv');

$file_id = $StorageMSV->getId($filepath);
return $StorageMSV->forceDelete($file_id);
```
