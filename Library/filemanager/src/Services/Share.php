<?php
namespace Min\FileManager\Services;

use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Min\FileManager\Traits\SystemDataTrait;
use SimpleXMLElement;

class Share
{
    use SystemDataTrait;
    private function ParseXML($response)
    {
        $xml = new SimpleXMLElement($response->getBody());
        $data = $xml->xpath('//data'); // extract data nodes from XML
        return json_decode(json_encode($data[0]), true);
    }
    public function getShare($id)
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
        $response = $client->request('GET', $baseUrl . $api . $id, [
            'headers' => $headers,
            'auth' => $auth,
        ]);
        return $this->ParseXML($response);
    }
    public function createShare($path, $shareType = 3, $expire = null)
    {
        try {
            $config = config('filesystems.disks.nextcloud');
            $baseUrl = $config['baseUri'];
            $api = '/ocs/v2.php/apps/files_sharing/api/v1/shares';
            $auth = [
                $config['userName'],
                $config['password'],
            ];
            $client = new Client();

            $headers = [
                'OCS-APIRequest' => 'true',
                'Content-Type' => 'application/x-www-form-urlencoded',
            ];
            $data = [
                'path' => $path,
                'shareType' => 3,
                'permissions' => 1, // 1 = read-only permissions
                'publicUpload' => false, // disable public upload for this share
            ];
            if($expire){
                $data['expireDate'] = $expire;
            }
            $response = $client->request('POST', $baseUrl . $api, [
                'headers' => $headers,
                'auth' => $auth,
                'form_params' => $data,
            ]);
            $dataRes = $this->ParseXML($response);
            $this->addShare($path, $dataRes);
            return $dataRes;
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return false;
        }
    }
    public function deleteShare($id)
    {
        try {
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
            $response = $client->request('DELETE', $baseUrl . $api . $id, [
                'headers' => $headers,
                'auth' => $auth,
            ]);
            $dataRes = $this->removeShare($id);
            return $dataRes;
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return false;
        }
    }
}
