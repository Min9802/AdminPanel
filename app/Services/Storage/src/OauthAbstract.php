<?php
namespace Min\Storage;
abstract class OauthAbstract
{
    private $config;

    private $redis;

    private $token;

    abstract function Oauth();
}
