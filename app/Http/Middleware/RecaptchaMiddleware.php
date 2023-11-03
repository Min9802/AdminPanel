<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\Recaptcha;

class RecaptchaMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $enableRecaptcha = config('system.recaptcha_enable');
        if ($enableRecaptcha) {
            $recaptcha = $request->recaptcha;
            $verify_captcha = Recaptcha::validate_captcha($recaptcha);
            if ($verify_captcha == false) {
                return response()->json([
                    'status' => 'error',
                    'message' => "res.recaptcha_false",
                ], 422);

            }
        }
        return $next($request);
    }
}
