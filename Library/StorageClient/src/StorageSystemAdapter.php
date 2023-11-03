<?php
namespace Min\StorageClient;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Traits\Conditionable;
use Illuminate\Support\Traits\Macroable;
use League\Flysystem\FilesystemOperator;
use League\Flysystem\PathPrefixer;

class StorageSystemAdapter extends FilesystemAdapter
{
    use Conditionable;
    use Macroable {
        __call as macroCall;
    }
    public function __construct(StorageFileSystem $driver, StorageDriveAdapter $adapter, array $config = [])
    {
        $this->driver = $driver;
        $this->adapter = $adapter;
        $this->config = $config;
        $separator = $config['directory_separator'] ?? DIRECTORY_SEPARATOR;

        $this->prefixer = new PathPrefixer($config['root'] ?? '', $separator);

        if (isset($config['prefix'])) {
            $this->prefixer = new PathPrefixer($this->prefixer->prefixPath($config['prefix']), $separator);
        }
    }
    /**
     * folder
     */
    public function listFolder($name)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'listFolder')) {
            return $adapter->listFolder($name);
        }
    }
    public function FolderExists($name)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'FolderExists')) {
            return $adapter->DirectoryExists($name);
        }
    }
    public function createDirectory($name)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'createFolder')) {
            return $adapter->createDirectory($name);
        }
    }
    public function renameDirectory($name, $newname)
    {
        $adapter = $this->adapter;
        return $adapter->renameDirectory($name, $newname);
    }
    public function getfileFolder($name)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'getfileFolder')) {
            return $adapter->getfileFolder($name);
        }
    }
    public function deleteFolder($name)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'deleteFolder')) {
            return $adapter->deleteFolder($name);
        }
    }
    /**
     * file
     */
    public function getInfo($path)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'getInfo')) {
            return $adapter->getInfo($path);
        } elseif (method_exists($this->driver, 'getInfo')) {
            return $this->driver->getInfo($path);
        }
    }
    public function mimeType($path)
    {
        $adapter = $this->adapter;
        return $this->adapter->mimeType($path);
    }
    public function getId($path)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'getId')) {
            return $adapter->getId($path);
        } elseif (method_exists($this->driver, 'getId')) {
            return $this->driver->getId($path);
        }
    }
    public function uploadFile($folder, $file)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'uploadFile')) {
            return $adapter->uploadFile($folder, $file);
        }
    }
    public function updateFile($folder, $file, $id)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'updateFile')) {
            return $adapter->updateFile($folder, $file, $id);
        }
    }
    public function renameFile($path, $newname)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'renameFile')) {
            return $adapter->renameFile($path, $newname);
        }
    }
    public function moveFile($path, $newpath)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'moveFile')) {
            return $adapter->moveFile($path, $newpath);
        }
    }
    public function restore($path)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'restoreFile')) {
            return $adapter->restore($path);
        }
    }
    public function forceDelete($path)
    {
        $adapter = $this->adapter;
        if (method_exists($adapter, 'forceDelete')) {
            return $adapter->forceDelete($path);
        }
    }
     public function __call($method, array $parameters)
    {
        if (static::hasMacro($method)) {
            return $this->macroCall($method, $parameters);
        }

        return $this->driver->{$method}(...$parameters);
    }
}
