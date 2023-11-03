<?php
namespace Min\StorageClient;

use League\Flysystem\Config;
use League\Flysystem\FilesystemAdapter;

interface StorageDriveAdapter
{
    public const LIST_SHALLOW = false;
    public const LIST_DEEP = true;

    public function listFolder();
    public function directoryExists(string $name);
    public function createDirectory(string $name);
    public function renameDirectory(string $name, string $newName);
    public function getfileFolder(string $name);
    public function deleteDirectory(string $name);

    public function getInfo($path);
    public function mimeType($path);
    public function stream($path);
    public function upload(string $folder, $file);
    public function update(string $folder, $file, $id);
    public function rename(string $path, string $newName);
    public function copy(string $path, string $folder);
    public function move(string $path, string $newfolder);
    public function delete(string $id);
    public function restore($id);
    public function forceDelete($id);
}
