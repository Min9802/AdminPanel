<?php
namespace Min\Storage\Oauth;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Min\Storage\OauthAbstract;

class Client extends OauthAbstract
{
    private $redis = null;
    private $token = null;
    private $auth = null;
    private $client = null;
    private $client_id = null;
    private $secret = null;
    private $option = null;
    public function __construct()
    {
        $this->option = config('storage.option');
        $this->auth = config('storage.token');
        $this->client = config('storage.client.uri');
        $this->client_id = config('storage.client.client_id');
        $this->secret = config('storage.client.client_secret');
        $this->redis = Redis::connection();
        $this->token = $this->redis->get('access_token');
        if (!$this->token) {
            $this->Oauth();
        }
    }
    public function Oauth()
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
        ])->post($this->client . $this->auth, [
            'grant_type' => "client_credentials",
            'client_id' => $this->client_id,
            'client_secret' => $this->secret,
            'scope' => 'storage',
        ]);

        $statuscode = $response->getStatusCode();
        if ($statuscode == 200) {
            $body = $response->getBody();
            $responseData = json_decode($body, true);
            $access_token = $responseData['access_token'];
            $expires_in = $responseData['expires_in'];
            $token = $access_token;
            $this->redis->set('access_token', $access_token);
            $expires = Carbon::now()->addMinute($expires_in / 60)->diffInSeconds();
            $this->redis->expire('access_token', $expires);
        } else {
            throw new \ErrorException('res.auth.fail');
            return false;
        }
    }
    public function get($type, $uri, $data = null)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $this->token,
        ])->get($this->client . $this->option[$type][$uri]);
        $body = $response->getBody();
        $statuscode = $response->getStatusCode();
        if ($statuscode == 200) {
            $responseData = json_decode($body, true);
            return $responseData;
        } else {
            throw new \ErrorException('res.request.fail');
            return false;
        }
    }
    public function post($type, $uri, $data = null, $params = null)
    {
        if ($uri == 'upload' || $uri == 'update') {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $this->token,
            ])->attach('file', file_get_contents($data['filepath']), $data['filename'])->post($this->client . $this->option[$type][$uri] . $params);
        } else {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $this->token,
            ])->post($this->client . $this->option[$type][$uri],$data);
        }

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
    }
    public function delete($type, $uri, $params = null)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $this->token,
        ])->delete($this->client . $this->option[$type][$uri] . $params);
        $body = $response->getBody();
        $statuscode = $response->getStatusCode();
        if ($statuscode == 200) {
            $responseData = json_decode($body, true);
            return $responseData;
        } else {
            throw new \ErrorException('res.request.fail');
            return false;
        }
    }

}
