<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as RequestFacade;
use Laravel\Passport\Client as PassportClient;
use Laravel\Passport\Token;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Encoding\ChainedFormatter;
use Exception;

class Client extends PassportClient
{
    protected $hidden = [
        // 'secret',
    ];
    public static function getClient(?Request $request = null): ?Client
    {
        try{
            $bearerToken = $request !== null ? $request->bearerToken() : RequestFacade::bearerToken();
            $parser = new Parser(new JoseEncoder());
            $JwtParser = $parser->parse($bearerToken);
            $tokenID = $JwtParser->claims()->get('jti');
            $clientId = Token::find($tokenID)->client->id;
            return (new static )->findOrFail($clientId);
        }catch (Exception $e) {
            Log::error('Message JWT parser :' . $e->getMessage() . '--line: ' . $e->getLine());
            return null;
        }
    }
    public function files()
    {
        return $this->belongsToMany(FileSystem::class, 'user_files', 'user_id', 'file_id');
    }
}
