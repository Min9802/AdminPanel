<?php

namespace App\Http\Controllers;


use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class TestController extends Controller
{
    public function test(Request $request)
    {
        $validator = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
        return response()->json($validator);
        // try {
        //     //$file = $request->file('file');
        //     //$filename = $file->getClientOriginalName();
        //     //$path = Storage::disk('nextcloud')->putFileAs('Storage', $file, $filename);
        //     //dd($path);

        //     $imageData = Storage::disk('nextcloud')->get('Cover-doc.jpg');

        //     $preview = Image::make(Storage::disk('nextcloud')->get('Cover-doc.jpg'));

        //     return $preview->response();
        // } catch (\Exception $e) {
        //     dd($e);
        // }

    }
    public function test1(Request $request)
    {
        try {
            // $file = $request->file('file');
            // $filename = $file->getClientOriginalName();
            // $path = Storage::disk('nextcloud')->putFileAs('Storage',$file, $filename);
            // return response()->json($path);
            $config = config('filesystems.disks.nextcloud');
            $baseUrl = $config['baseUri'];
            $api = '/ocs/v2.php/apps/files_sharing/api/v1/shares';
            $auth = [
                $config['userName'],
                $config['password'],
            ];
            $client = new Client();
            $data = [
                'search' => 'video1.mp4',
                'lookup' => true,
                'perPage' => 1,
                'itemType' => 'file',
            ];
            $headers = [
                'OCS-APIRequest' => 'true',
                'Content-Type' => 'application/x-www-form-urlencoded',
            ];
            $response = $client->request('GET', $baseUrl . $api, [
                'headers' => $headers,
                'auth' => $auth,
            ]);
            return response($response->getBody());
        } catch (\Exception $e) {
            Log::error('Message register nextcloud :' . $e->getMessage() . '--line: ' . $e->getLine());
        }
    }
    public function test3(Request $request)
    {
        $config = config('filesystems.disks.nextcloud');
        $baseUrl = $config['baseUri'];
        $api = '/ocs/v2.php/apps/files_sharing/api/v1/shares/';
        $auth = [
            $config['userName'],
            $config['password'],
        ];
        $client = new Client();

        $headers = [
            'OCS-APIRequest' => 'true',
            'Content-Type' => 'application/x-www-form-urlencoded',
        ];

        $response = $client->request('DELETE', $baseUrl . $api . $request->id, [
            'headers' => $headers,
            'auth' => $auth,
        ]);
        return $response->getBody();
    }

}
