<?php
namespace App\Services;


use Illuminate\Support\Facades\Log;
use Google2FA;

class TwoFactorService
{

    /**
     * generate QR code.
     *
     * @param object $user
     *
     * @return $data
     */

    public function generate($user)
    {
        // generate secret code
        $secretCode = Google2FA::generateSecretKey();
        try {
            $qrCodeData = Google2FA::getQRCodeUrl(
                config("app.name"),
                $user->email,
                $secretCode,
            );
            $data = [
                'qrdata' => $qrCodeData,
                'secret' => $secretCode
            ];

            return $data;
        } catch (\Exception $exception) {
            Log::error('Message :' . $exception->getMessage() . '--line: ' . $exception->getLine());
        }
    }
}
