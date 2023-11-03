<?php
namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;

class StorageService
{
    /**
     * upload service
     * @param object $file
     */
    public static $redis = null;
    public static $token = null;
    private static $config = [
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
            'rename' => '/api/storage/client/folder/rename/'
        ]
    ];
    private static $auth = [
        'token' => '/api/oauth/token',
    ];

    public static function init()
    {
        self::$redis = Redis::connection();
        self::$token = static::$redis->get('access_token');

    }
    public static function Oauth()
    {
        $redis = Redis::connection();
        $token = $redis->get('access_token');
        $client = config('system.msv_client');
        $client_id = config('system.msv_client_id');
        $secret = config('system.msv_client_secret');
        if (!$token) {

            $response = Http::withHeaders([
                'Accept' => 'application/json',
            ])->post($client . self::$auth['token'], [
                'grant_type' => "client_credentials",
                'client_id' => $client_id,
                'client_secret' => $secret,
                'scope' => 'storage',
            ]);
            $statuscode = $response->getStatusCode();
            if ($statuscode == 200) {
                $body = $response->getBody();
                $responseData = json_decode($body, true);
                $access_token = $responseData['access_token'];
                $expires_in = $responseData['expires_in'];
                $token = $access_token;
                $redis->set('access_token', $access_token);
                $expires = Carbon::now()->addMinute($expires_in / 60)->diffInSeconds();
                $redis->expire('access_token', $expires);
            } else {
                throw new \ErrorException('res.auth.fail');
                return false;
            }

        }
    }
    public static function upload($file)
    {
        StorageService::init();
        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }
        try {

            $filepath = $file->getPathname();
            $filename = $file->getClientOriginalName();
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . self::$token,
            ])->attach('file', file_get_contents($filepath), $filename)->post($client . self::$config['upload']);

            $statuscode = $response->getStatusCode();
            if ($statuscode == 200) {
                $body = $response->getBody();
                $responseData = json_decode($body, true);
                return $responseData;
            } else {
                throw new \ErrorException('res.request.fail');
                Log::error('Message upload :' . json_decode($response, true));
                return false;
            }

        } catch (\Exception$e) {
            Log::error('Message upload :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
            return response()->json($data, 500);
        }

    }
    /**
     * update service
     * @param object $fileSelect
     * @param object $file
     */
    public static function update($fileSelect, $file)
    {
        StorageService::init();
        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }

        try {
            $filepath = $file->getPathname();
            $filename = $file->getClientOriginalName();
            $fileChange = StorageService::getfile($fileSelect->hash);

            if ($fileChange) {
                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer ' . self::$token,
                ])->attach('file', file_get_contents($filepath), $filename)
                    ->post($client . self::$config['update'] . $fileChange['id']);
                $statuscode = $response->getStatusCode();
                $body = $response->getBody();
                if ($statuscode == 200) {

                    $responseData = json_decode($body, true);

                    return $responseData['content'];
                } else {
                    throw new \ErrorException('res.request.fail');
                    Log::error('Message update :' . $response);
                    return false;
                }

            } else {
                return false;
            }

        } catch (\Exception$e) {
            Log::error('Message update :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
            return response()->json($data, 500);
        }

    }
    /**
     * get all file
     */
    public static function allfile()
    {
        StorageService::init();
        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . self::$token,
            ])->post($client . self::$config['allfile']);
            $body = $response->getBody();
            $statuscode = $response->getStatusCode();
            if ($statuscode == 200) {
                $responseData = json_decode($body, true);
                return $responseData['content'];
            } else {
                throw new \ErrorException('res.request.fail');
                return false;
            }

        } catch (\Exception$e) {
            Log::error('Message get all :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => 'res.getdata.fail',
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * get file
     */
    public static function getfile($hashname)
    {
        StorageService::init();
        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . self::$token,
            ])->post($client . self::$config['getfile'], [
                'hash' => $hashname,
            ]);
            $body = $response->getBody();
            $statuscode = $response->getStatusCode();
            if ($statuscode == 200) {
                $responseData = json_decode($body, true);
                return $responseData['content'];
            } else {
                throw new \ErrorException('res.request.fail');
                return false;
            }

        } catch (\Exception$e) {
            Log::error('Message get file :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => 'res.getdata.fail',
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * delete file
     */
    public static function delete($file)
    {
        StorageService::init();
        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }

        try {
            $fileSelect = StorageService::getfile($file->hash);
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . self::$token,
            ])->delete($client . self::$config['delete'] . $fileSelect['id']);
            $body = $response->getBody();
            $statuscode = $response->getStatusCode();
            if ($statuscode == 200) {
                $responseData = json_decode($body, true);
                return $responseData;
            } else {
                throw new \ErrorException('res.request.fail');
                return false;

            }

        } catch (\Exception$e) {
            Log::error('Message delete :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => 'res.delete.fail',
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * get trash
     */
    public static function trash()
    {
        StorageService::init();
        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . self::$token,
            ])->get($client . self::$config['trash']);
            $body = $response->getBody();
            $statuscode = $response->getStatusCode();
            if ($statuscode == 200) {
                $responseData = json_decode($body, true);
                return $responseData;
            } else {
                throw new \ErrorException('res.request.fail');
                return false;
            }

        } catch (\Exception$e) {
            Log::error('Message trash :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => 'res.getdata.fail',
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * restore file
     * @param object $file
     */
    public static function restore($file)
    {
        StorageService::init();

        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }

        try {
            $fileSelect = StorageService::getfile($file->hash);
            if ($fileSelect) {
                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer ' . self::$token,
                ])->get($client . self::$config['restore'] . $fileSelect['id']);
                $body = $response->getBody();
                $statuscode = $response->getStatusCode();
                if ($statuscode == 200) {
                    $responseData = json_decode($body, true);
                    return $responseData;
                } else {
                    throw new \ErrorException('res.request.fail');
                    return false;
                }

            } else {
                throw new \ErrorException('res.restore.fail');
            }

        } catch (\Exception$e) {
            Log::error('Message restore :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => 'res.restore.fail',
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * force delete
     * @param object $file
     */
    public static function forceDelete($file)
    {
        StorageService::init();
        $client = config('system.msv_client');

        if (!self::$token) {
            StorageService::Oauth();
        }

        try {
            $fileSelect = StorageService::getfile($file->hash);
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . self::$token,
            ])->delete($client . self::$config['forcedelete'] . $fileSelect['id']);
            $body = $response->getBody();
            $statuscode = $response->getStatusCode();
            if ($statuscode == 200) {
                $responseData = json_decode($body, true);
                return $responseData;
            } else {
                throw new \ErrorException('res.request.fail');
                return false;
            }

        } catch (\Exception$e) {
            Log::error('Message force Delete :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => 'res.restore.fail',
            ];
            return response()->json($data, 500);
        }
    }
}
