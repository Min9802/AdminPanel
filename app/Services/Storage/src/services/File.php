<?php

namespace Min\Storage\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Min\Storage\FileAbtract;
use Min\Storage\Oauth\Client;

class File extends FileAbtract
{
    private $client;
    public function __construct()
    {
        $this->client = new Client;
    }
    public function get($hashname)
    {
        try {
            $response = $this->client->post('file', 'get', [
                'hash' => $hashname,
            ]);
            return $response;

        } catch (Exception $exception) {
            Log::error('Message getfile :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            $data = [
                'status' => 'error',
                'message' => $exception->getMessage(),
            ];
            return response()->json($data, 500);
        }
    }
    function list() {
        try {
            $response = $this->client->get('file', 'list');
            return $response;
        } catch (Exception $exception) {
            Log::error('Message list :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            $data = [
                'status' => 'error',
                'message' => $exception->getMessage(),
            ];
            return response()->json($data, 500);
        }
    }
    public function upload($file)
    {
        try {
            $filepath = $file->getPathname();
            $filename = $file->getClientOriginalName();
            $response = $this->client->post('file', 'upload', [
                'filename' => $filename,
                'filepath' => $filepath,
            ]);
            return $response;

        } catch (Exception $exception) {
            Log::error('Message upload :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            $data = [
                'status' => 'error',
                'message' => $exception->getMessage(),
            ];
            return response()->json($data, 500);
        }

    }
    public function update($fileSelect, $file)
    {
        try {
            $filepath = $file->getPathname();
            $filename = $file->getClientOriginalName();
            $fileChange = $this->get($fileSelect['hash']);

            if ($fileChange) {
                $response = $this->client->post('file', 'update', [
                    'filename' => $filename,
                    'filepath' => $filepath,
                ], $fileChange['id']);
                return $response;
            } else {
                return false;
            }

        } catch (Exception $exception) {
            Log::error('Message update :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            $data = [
                'status' => 'error',
                'message' => $exception->getMessage(),
            ];
            return response()->json($data, 500);
        }

    }
    public function delete($file)
    {
        try {
            $fileSelect = $this->get($file->hash);
            $response =  $this->client->delete('file', 'delete', $fileSelect['id']);
            return $response;
        } catch (Exception $exception) {
            Log::error('Message delete :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            $data = [
                'status' => 'error',
                'message' => $exception->getMessage(),
            ];
            return response()->json($data, 500);
        }
    }

    public function forceDelete($file)
    {
        try {
            $fileSelect = $this->get($file->hash);
            $response =  $this->client->get('file', 'forcedelete', $fileSelect->id);
            return $response;
        } catch (Exception $exception) {
            Log::error('Message restore :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            $data = [
                'status' => 'error',
                'message' => $exception->getMessage(),
            ];
            return response()->json($data, 500);
        }
    }
}
