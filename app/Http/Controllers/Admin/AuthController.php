<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Models\Admin\Admin;
use App\Models\Client;
use App\Services\Recaptcha;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Laravel\Passport\ClientRepository;
class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    private $admin;
    private $recaptcha;
     private $client;
    public function __construct(Admin $admin, Recaptcha $recaptcha, Client $client )
    {
        $this->admin = $admin;
        $this->recaptcha = $recaptcha;
        $this->client = $client;
    }
    /**
     * Display a listing of the resource.
     * @method post
     * @param string $username
     * @param string $password
     * @param object $request
     * @return \Illuminate\Http\Response
     *
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        $data = [
            'username' => $request->username,
            'password' => $request->password,
        ];
        $enableRecaptcha = config('system.recaptcha_enable');
        if ($enableRecaptcha) {
            $recaptcha = $request->recaptcha;
            $verify_captcha = $this->recaptcha->validate_captcha($recaptcha);
            if ($verify_captcha == false) {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('auth.recaptcha_false'),
                ], 422);

            }
        }
        if (!Auth::attempt($data)) {
            return response()->json([
                'status' => 'error',
                'message' => trans('auth.incorrect'),
            ], 401);
        }
        $user = $request->user();
        $tokenResult = $user->createToken('Access Token');
        $token = $tokenResult->token;
        if ($request->remember_me) {
            $token->expires_at = Carbon::now()->addWeeks(1);
        }
        $token->save();
        $request->headers->set('Authorization', 'Bearer ' . $tokenResult->accessToken);
        Cookie::queue('token', $tokenResult->accessToken);
         return response()->json([
            'status' => 'success',
            'message' => trans('auth.success'),
            'content' => [
                'access_token' => $tokenResult->accessToken,
                'token_type' => 'Bearer',
                'expires_in' => Carbon::parse(
                    $tokenResult->token->expires_at
                )->toDateTimeString(),
                'user' => $user
            ],

        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     * @method post
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {

            $request->user()->token()->revoke();

            return response()->json([
                'status' => 'success',
                'message' => trans('auth.logout.success'),
            ]);

        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'success',
                'message' => trans('auth.requirelogin'),
            ], 401);
        }

    }

    /**
     * Refresh a token.
     * @method post
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->createNewToken(Auth::refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function info()
    {
        $admin = Auth::user();
        if (!$admin) {
            return response()->json([
                'status' => 'error',
                'message' => trans('auth.notfound'),
            ]);
        }
        $admin->permissions;
        return response()->json([
            'status' => 'success',
            'content' => $admin
        ]);
    }
}
