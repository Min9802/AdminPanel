<?php
namespace App\Services;

use GuzzleHttp\Client;

class Recaptcha
{

    static function validate_captcha($recaptcha)
    {

        $recaptcha_secret = config('app.recaptcha_secret') ?? env('GOOGLE_RECAPTCHA_SECRET');

        $recaptcha_response = $recaptcha;
        $url = "https://www.google.com/recaptcha/api/siteverify";

        $client = new Client;

        $data = [
            'secret' => $recaptcha_secret,
            'response' => $recaptcha_response,
        ];

        $response = $client->request('POST', $url, ['query' => $data]);

        $decode_captcha = json_decode($response->getBody(), true);
        return $decode_captcha;
    }
}


