<?php
namespace Min\Storage\Services;

use Illuminate\Support\Facades\Log;
use Min\Storage\Oauth\Client;
use Min\Storage\Storage;

class StorageService extends Storage
{
    /**
     * upload service
     * @param object $file
     */

    public function __construct()
    {

    }
    public function upload($file)
    {
        $client = new Client;
        try {
            $filepath = $file->getPathname();
            $filename = $file->getClientOriginalName();
            $response = $client->post('file', 'upload', [
                'filename' => $filename,
                'filepath' => $filepath,
            ]);
            return $response;

        } catch (\Exception$e) {
            Log::error('Message upload :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
            return response()->json($data, 500);
        }

    }
    public function update($fileSelect, $file)
    {
        $client = new Client;

        try {
            $filepath = $file->getPathname();
            $filename = $file->getClientOriginalName();
            $fileChange = $this->getfile($fileSelect->hash);
            if ($fileChange) {
                $response = $client->post('file', 'update', [
                    'filename' => $filename,
                    'filepath' => $filepath,
                ], $fileChange['id']);
                return $response;
            } else {
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
    public function allfile()
    {
        # code...
    }
    public function getfile($hashname)
    {
        $client = new Client;
        try {
            $response = $client->post('file', 'get', [
                'hash' => $hashname,
            ]);
            return $response;

        } catch (\Exception$e) {
            Log::error('Message get file :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => 'res.getdata.fail',
            ];
            return response()->json($data, 500);
        }
    }
    public function delete($file)
    {
        # code...
    }
    public function trash()
    {
        # code...
    }
    public function restore($file)
    {
        # code...
    }
    public function forceDelete($file)
    {
        # code...
    }

}
