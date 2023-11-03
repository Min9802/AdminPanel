<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Http\Requests\Admin\TwoFactoryRequest;
use App\Notifications\OTP;
use App\Services\TwoFactorService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Google2FA;


class TwoFactoryAuthController extends Controller
{
    private $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;

    }
    /**
     * GenerateQR.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getQR(Request $request)
    {
        $user = Auth::user();
        try {
            $data = $this->twoFactorService->generate($user);

            $QrData = $data['qrdata'];
            $secretCode = $data['secret'];
            $user->secret_code = $secretCode;
            $user->save();

            $request->session()->put('google2fa', $secretCode);

            return response()->json([
                'status' => 'success',
                'content' => [
                    'qrdata' => $QrData,
                    'secret' => $secretCode,
                ],
            ]);

        } catch (Exception $exception) {
            Log::error('Message :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.twoFactor.getqr.fail'),
            ], 500);
        }

    }
    /**
     * enable 2FA.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @param string $code
     * @return \Illuminate\Http\Response
     */
    public function enable(TwoFactoryRequest $request)
    {
        $user = Auth::user();
        $code = $request->code;
        $googleAuthenticator = new Google2FA;
        $secretCode = $user->secret_code;
        if (!$googleAuthenticator->verifyKey($secretCode, $code, 8)) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.verify.fail'),
            ], 500);
        }
        $user = Auth::user();
        try {
            $user->status_2fa = 1;
            $user->save();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.enable.success'),
            ]);

        } catch (Exception $exception) {
            Log::error('Message :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.enable.fail'),
            ], 500);
        }

    }
    /**
     * disable 2FA.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function disable(Request $request)
    {
        $user = Auth::user();

        try {
            $user->status_2fa = 0;
            $user->save();
            // Cookie::queue(Cookie::forget('2fa_verified'));
            session(["2fa_verified" => false]);
            $data = [
                'status' => 'success',
                'message' => trans('res.disable.success'),
            ];
            return response()->json($data);
        } catch (Exception $exception) {
            Log::error('Message :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.disable.fail'),
            ], 500);
        }
    }
    /**
     * verify 2FA.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @param string $code
     * @return \Illuminate\Http\Response
     */
    public function verify(TwoFactoryRequest $request)
    {
        $user = Auth::user();
        $code = $request->code;
        $googleAuthenticator = new Google2FA;
        $secretCode = $user->secret_code;
        try {
            $googleAuthenticator->verifyKey($secretCode, $request->get("code"), 8);
            $data = [
                'status' => 'success',
                'message' => trans('res.verify.success'),
            ];
            return response()->json($data);
        } catch (Exception $exception) {
            Log::error('Message :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.verify.fail'),
            ], 500);
        }

    }
    /**
     * getOTP email.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\Response
     */
    public function getotp()
    {
        try {
            $user = Auth::user();
            $token = Helper::random('number', 6);
            $user->OTP = Hash::make($token);
            $user->save();
            $data = [
                'title' => $user->username,
                'content' => 'Mail OTP',
                'content' => $token,
            ];
            $user->notify((new OTP($data)));
            return response()->json([
                'status' => 'success',
                'message' => trans('res.getotp.success'),
            ]);
        } catch (Exception $exception) {
            Log::error('Message :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.getotp.fail'),
            ], 500);
        }
    }
    /**
     * verify email.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @param string $code
     * @return \Illuminate\Http\Response
     */
    public function otpverify(TwoFactoryRequest $request)
    {
        try {
            $user = Auth::user();
            $code = $request->code;
            $verify = Hash::check($code, $user->OTP);
            if ($verify) {
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.loginsuccess'),
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('res.verify.fail'),
                ], 500);
            }

        } catch (Exception $exception) {
            Log::error('Message :' . $exception->getMessage() . '--line: ' . $exception->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.verify.fail'),
            ], 500);

        }
    }
}
