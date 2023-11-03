<?php
namespace Min\StorageClient;

use League\Flysystem\FileAttributes;

class StorageAdapter implements StorageDriveAdapter
{
    protected $client;
    protected $drive;

    public function __construct(StorageClient $client, StorageDrive $drive, $option = [])
    {
        $this->client = $client;
        $this->drive = $drive;
    }
    public function getMetaData($path, $option): FileAttributes
    {
        switch ($option) {
            case 'fileSize':
                $fileSize = $this->drive->getFileSize($path);
                return new FileAttributes($path, $fileSize);
                break;
            case 'visibility':
                $visibility = $this->drive->getVisibility($path);
                return new FileAttributes($path, null, $visibility);
                break;
            case 'lastModified':
                $lastModified = $this->drive->getLastModified($path);
                return new FileAttributes($path, null, null, $lastModified);
                break;
            case 'mimeType':
                $mimeType = $this->drive->getMimeType($path);
                return new FileAttributes($path, null, null, null, $mimeType);
                break;
            default:
                $fileSize = $this->drive->getFileSize($path);
                $visibility = $this->drive->getVisibility($path);
                $lastModified = $this->drive->getLastModified($path);
                $mimeType = $this->drive->getMimeType($path);
                return new FileAttributes($path, $fileSize, $visibility, $lastModified, $mimeType);
                break;
        }

    }
    /**
     * folder
     */
    public function listFolder()
    {
        $response = $this->drive->listFolder();
        $content = $response['content'];
        return $content;
    }
    public function createDirectory($directory)
    {
        $response = $this->drive->createDirectory($directory);
        $content = $response['content'];
        return $content;
    }
    public function directoryExists($directory)
    {
        $response = $this->drive->directoryExists($directory);
        $content = $response['message'];
        return $content;
    }
    public function deleteDirectory($directory)
    {
        $response = $this->drive->deleteDirectory($directory);
        $content = $response['message'];
        return $content;
    }
    public function renameDirectory($name, $newName)
    {
        $response = $this->drive->renameDirectory($name, $newName);
        $content = $response['content'];
        return $content;
    }
    public function getfileFolder($name)
    {
        $response = $this->drive->getfileFolder($name);
        $content = $response['content'];
        return $content;
    }
    /**
     * file
     */
    public function getInfo($name)
    {
        $response = $this->drive->getFile($name);
        $content = $response['content'];
        return $content;
    }
    public function getUrl($path)
    {
        $response = $this->drive->url($path);
        $content = $response['content'];
        $url = $content["url"];
        return $url;
    }
    public function getId($name)
    {
        $response = $this->drive->getId($name);
        $content = $response['content'];
        $id = $content["id"];
        return $id;
    }
    public function stream($path)
    {
        $response = $this->drive->stream($path);
        return $response;
    }
    public function fileExists(string $path): bool
    {
        return $this->drive->fileExists($path);
    }
    public function upload(string $folder, $contents)
    {
        $response = $this->drive->upload($folder, $contents);
        $content = $response['content'];
        return $content;
    }
    public function update(string $path, $contents, $id)
    {
        $response = $this->drive->update($path, $contents);
        $content = $response['content'];
        return $content;
    }
    public function rename(string $path, string $newname)
    {
        $response = $this->drive->rename($path, $newname);
        $content = $response['content'];
        return $content;
    }

    public function copy(string $path, string $newPath)
    {
        $response = $this->drive->copy($path, $newPath);
        $content = $response['content'];
        return $content;
    }
    public function move($path, string $folder)
    {
        $response = $this->drive->move($path, $folder);
        $content = $response['content'];
        return $content;
    }
    public function delete(string $id)
    {
        $response = $this->drive->deleteFile($id);
        $content = $response['content'];
        return $content;
    }

    public function restore($id)
    {
        $this->drive->restoreFile($id);
    }
    public function forceDelete($id)
    {
        $response = $this->drive->forceDeleteFile($id);
        $content = $response['content'];
        return $content;
    }
    /**
     *
     */
    public function setVisibility(string $path, string $visibility)
    {
        $response = $this->drive->setVisibility($path, $visibility);
        $content = $response['content'];
        return $content;
    }

    public function visibility(string $path): FileAttributes
    {
        return $this->getMetaData($path, 'visibility');
    }

    public function mimeType($path)
    {
        return $this->drive->mimeType($path);
    }

    public function lastModified(string $path): FileAttributes
    {
        return $this->getMetaData($path, 'lastModified');
    }

}
