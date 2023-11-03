<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as RequestFacade;
use Laravel\Passport\Token;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (!$request) {
            abort(401,"Unauthenticated");
        }
    }
    public function handle($request, Closure $next, ...$guards)
    {
        try {
            if($request->bearerToken() != null){
                $bearerToken = $request->bearerToken() != null ? $request->bearerToken() : RequestFacade::bearerToken();
                $parser = new Parser(new JoseEncoder());
                $JwtParser = $parser->parse($bearerToken);
                $tokenID = $JwtParser->claims()->get('jti');
                $user = Token::find($tokenID)->user;
                $this->authenticate($user, $guards);
                return $next($request);
            }else{
                abort(401,"Unauthenticated");
            }
        } catch (Exception $e) {
            abort(401, "Unauthenticated");
            Log::error('Message authenticate :' . $e->getMessage() . '--line: ' . $e->getLine());
        }

    }
}
