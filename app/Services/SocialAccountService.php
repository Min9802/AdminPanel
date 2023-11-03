<?php

namespace App\Services;

use App\Models\Member;
use App\Models\SocialAccount;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Contracts\User as ProviderUser;


class SocialAccountService
{
    public static function createOrGetUser(ProviderUser $providerUser, $social)
    {   
        $account = SocialAccount::whereProvider($social)
            ->whereProviderUserId($providerUser->getId())
            ->first();
        function stripVN($str)
        {
            $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
            $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", 'e', $str);
            $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
            $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", 'o', $str);
            $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
            $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
            $str = preg_replace("/(đ)/", 'd', $str);

            $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
            $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
            $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
            $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", 'O', $str);
            $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
            $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", 'Y', $str);
            $str = preg_replace("/(Đ)/", 'D', $str);
            $str = preg_replace("/( )/", '', $str);
            return $str;
        }
        if ($account) {
            if($account->user){
                if($account->user->verified == 0){
                    Member::where('id','=',$account->user->id)->update([
                        'verified'=>1,
                    ]);
                    return $account->user;
                }
                return $account->user;
            }
            return $account->user;
        } else {
            $gmail = $providerUser->getEmail() ?? $providerUser->getNickname();
            $changemail =1;
            $username = stripVN($providerUser->getName());
            $password = Hash::make(stripVN($providerUser->getName()));
            if ($gmail == null) {
                $email = stripVN($providerUser->getName()) . '@gmail.com';
                $changemail = 0;
            }else{
                $email = $gmail;
            }
            $account = new SocialAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => $social
            ]);

            $user = Member::whereEmail($email)->first();
            if (!$user) {
                $check = Member::where('username','=',$username)->count();
                if($check == 0){
                    $user = Member::create([
                        'username' => stripVN($providerUser->getName()),
                        'fullname' => $providerUser->getName(),
                        'email' => $email,
                        'password' => $password,
                        'verified'=> 1,
                        'type'     => 'social',
                        'change_pass'=>0,
                        'change_email'=>$changemail,
                    ]);
                }else{
                   if($check >=1 ){
                    $user = Member::create([
                        'username' => stripVN($providerUser->getName()).($check+1),
                        'fullname' => $providerUser->getName(),
                        'email' => $email,
                        'password' => $password,
                        'verified'=> 1,
                        'type'     => 'social',
                        'change_pass'=>0,
                        'change_email'=>$changemail,
                    ]); 
                   }
                }
                
            }


            $account->user()->associate($user);
            $account->save();

            return $user;
        }
    }
}
