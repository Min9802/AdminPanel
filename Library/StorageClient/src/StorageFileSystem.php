<?php

declare(strict_types=1);

namespace Min\StorageClient;

use DateTimeInterface;
use Generator;
use League\Flysystem\CalculateChecksumFromStream;
use League\Flysystem\ChecksumAlgoIsNotSupported;
use League\Flysystem\ChecksumProvider;
use League\Flysystem\Config;
use League\Flysystem\DirectoryListing;
use League\Flysystem\FilesystemOperator;
use League\Flysystem\InvalidStreamProvided;
use League\Flysystem\PathNormalizer;
use League\Flysystem\UnableToGeneratePublicUrl;
use League\Flysystem\UnableToGenerateTemporaryUrl;
use League\Flysystem\UnableToListContents;
use League\Flysystem\UrlGeneration\ShardedPrefixPublicUrlGenerator;
use League\Flysystem\UrlGeneration\PrefixPublicUrlGenerator;
use League\Flysystem\UrlGeneration\PublicUrlGenerator;
use League\Flysystem\UrlGeneration\TemporaryUrlGenerator;
use League\Flysystem\WhitespacePathNormalizer;
use Min\StorageClient\StorageSystemAdapter;
use Throwable;

use function is_array;

class StorageFileSystem implements StorageDriveAdapter
{
    use CalculateChecksumFromStream;

    private Config $config;
    private PathNormalizer $pathNormalizer;

    public function __construct(
        private StorageAdapter $adapter,
        array $config = [],
        PathNormalizer $pathNormalizer = null,
        private ?PublicUrlGenerator $publicUrlGenerator = null,
        private ?TemporaryUrlGenerator $temporaryUrlGenerator = null,
    ) {
        $this->config = new Config($config);
        $this->pathNormalizer = $pathNormalizer ?: new WhitespacePathNormalizer();
    }
    public function fileExists(string $location): bool
    {
        return $this->adapter->fileExists($this->pathNormalizer->normalizePath($location));
    }
    public function getInfo($path)
    {
        return $this->adapter->getInfo($path);

    }
    public function mimeType($path)
    {
        return $this->adapter->mimeType($path);

    }
    public function read(string $location): string
    {
        return $this->adapter->getInfo($location);
    }
    public function stream($location)
    {
        return $this->adapter->stream($location);
    }
    public function upload($folder, $file)
    {
        return $this->adapter->upload($folder, $file);
    }
    public function update($path, $file, $id)
    {
        return $this->adapter->update($path, $file, $id);
    }
    public function move(string $source, string $destination, array $config = []): void
    {
        $this->adapter->move(
            $this->pathNormalizer->normalizePath($source),
            $this->pathNormalizer->normalizePath($destination),
            $this->config->extend($config)
        );
    }

    public function copy(string $path, string $newpath, array $config = []): void
    {
        $this->adapter->copy(
            $this->pathNormalizer->normalizePath($path ),
            $this->pathNormalizer->normalizePath($newpath),
            $this->config->extend($config)
        );
    }
    public function rename($path, $newName)
    {
        return $this->adapter->rename($path, $newName);
    }
    public function readStream(string $location)
    {
        return $this->adapter->stream($this->pathNormalizer->normalizePath($location));
    }

    public function delete(string $location): void
    {
        $this->adapter->delete($location);
    }
    public function restore($id)
    {
        return $this->adapter->restore($id);
    }
    public function forcedelete($location)
    {
        $this->adapter->forcedelete($location);
    }

    public function listFolder()
    {
        return $this->adapter->listFolder();
    }
    public function getfileFolder($name)
    {
       return $this->adapter->getFileFolder($name);
    }
    public function directoryExists(string $location): bool
    {
        return $this->adapter->directoryExists($this->pathNormalizer->normalizePath($location));
    }
    public function renameDirectory($name, $newName)
    {
        return $this->adapter->renameDirectory($name, $newName);
    }
    public function deleteDirectory(string $location): void
    {
        $this->adapter->deleteDirectory($this->pathNormalizer->normalizePath($location));
    }
    public function createDirectory(string $location, array $config = []): void
    {
        $this->adapter->createDirectory(
            $this->pathNormalizer->normalizePath($location),
            $this->config->extend($config)
        );
    }
    public function has(string $location): bool
    {
        $path = $this->pathNormalizer->normalizePath($location);

        return $this->adapter->fileExists($path) || $this->adapter->directoryExists($path);
    }

    public function listContents(string $location, bool $deep = self::LIST_SHALLOW): DirectoryListing
    {
        $path = $this->pathNormalizer->normalizePath($location);
        $listing = $this->adapter->listContents($path, $deep);

        return new DirectoryListing($this->pipeListing($location, $deep, $listing));
    }

    private function pipeListing(string $location, bool $deep, iterable $listing): Generator
    {
        try {
            foreach ($listing as $item) {
                yield $item;
            }
        } catch (Throwable $exception) {
            throw UnableToListContents::atLocation($location, $deep, $exception);
        }
    }
    public function setVisibility(string $path, string $visibility): void
    {
        $this->adapter->setVisibility($this->pathNormalizer->normalizePath($path), $visibility);
    }

    public function visibility(string $path): string
    {
        return $this->adapter->visibility($this->pathNormalizer->normalizePath($path))->visibility();
    }

    public function publicUrl(string $path, array $config = []): string
    {
        $this->publicUrlGenerator ??= $this->resolvePublicUrlGenerator()
            ?: throw UnableToGeneratePublicUrl::noGeneratorConfigured($path);
        $config = $this->config->extend($config);

        return $this->publicUrlGenerator->publicUrl($path, $config);
    }

    public function temporaryUrl(string $path, DateTimeInterface $expiresAt, array $config = []): string
    {
        $generator = $this->temporaryUrlGenerator ?: $this->adapter;

        if ($generator instanceof TemporaryUrlGenerator) {
            return $generator->temporaryUrl($path, $expiresAt, $this->config->extend($config));
        }

        throw UnableToGenerateTemporaryUrl::noGeneratorConfigured($path);
    }

    public function checksum(string $path, array $config = []): string
    {
        $config = $this->config->extend($config);

        if ( ! $this->adapter instanceof ChecksumProvider) {
            return $this->calculateChecksumFromStream($path, $config);
        }

        try {
            return $this->adapter->checksum($path, $config);
        } catch (ChecksumAlgoIsNotSupported) {
            return $this->calculateChecksumFromStream($path, $config);
        }
    }

    private function resolvePublicUrlGenerator(): ?PublicUrlGenerator
    {
        if ($publicUrl = $this->config->get('public_url')) {
            return match (true) {
                is_array($publicUrl) => new ShardedPrefixPublicUrlGenerator($publicUrl),
                default => new PrefixPublicUrlGenerator($publicUrl),
            };
        }

        if ($this->adapter instanceof PublicUrlGenerator) {
            return $this->adapter;
        }

        return null;
    }

    /**
     * @param mixed $contents
     */
    private function assertIsResource($contents): void
    {
        if (is_resource($contents) === false) {
            throw new InvalidStreamProvided(
                "Invalid stream provided, expected stream resource, received " . gettype($contents)
            );
        } elseif ($type = get_resource_type($contents) !== 'stream') {
            throw new InvalidStreamProvided(
                "Invalid stream provided, expected stream resource, received resource of type " . $type
            );
        }
    }

    /**
     * @param resource $resource
     */
    private function rewindStream($resource): void
    {
        if (ftell($resource) !== 0 && stream_get_meta_data($resource)['seekable']) {
            rewind($resource);
        }
    }
}
