<?php
namespace App\Helpers;

class Helper
{
    public static function random($format,$length)
    {
        switch($format){
            case 'text':
                $str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                break;
            case 'number':
                $str = "0123456789";
                break;
            default:
            $str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        }
        $randStr = substr(str_shuffle($str), 0, $length);
        return $randStr;
    }
}
