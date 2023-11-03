<?php

namespace App\Http\Controllers\Admin;

use App\Events\Admin\SettingEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddSettingRequest;
use App\Jobs\Admin\SaveConfigJob;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
    /**
     * Create a new RoleController instance.
     *
     * @return void
     */

    public function __construct()
    {

    }
    /**
     * Display a listing of the resource.
     * @method get
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }
    /**
     * Display a listing of the resource.
     * @method get
     * @return \Illuminate\Http\Response
     */
    public function config()
    {
        try {
            $settings = [
                'storage' => [
                    'disk' => config('system.disk', 'local'),
                    'disk_client' => config('system.disk_client', env('NEXT_CLOUD_URI','https://storage.min-services.com')),
                    'disk_client_id' => config('system.disk_client_id', env('NEXT_CLOUD_USER','Min')),
                    'disk_client_secret' => config('system.disk_client_secret', env('NEXT_CLOUD_SECRET','9txbE-c5dnt-HxNyg-nwwXk-7yCcj')),
                ],
                'smtp' => [
                    'smtp_template' => config('system.smtp_template', 'default'),
                    'smtp_host' => config('system.smtp_host', env('MAIL_HOST')),
                    'smtp_port' => config('system.smtp_port', env('MAIL_PORT')),
                    'smtp_username' => config('system.smtp_username', env('MAIL_USERNAME')),
                    'smtp_password' => config('system.smtp_password', env('MAIL_PASSWORD')),
                    'smtp_encryption' => config('system.smtp_encryption', env('MAIL_ENCRYPTION')),
                    'smtp_from_address' => config('system.smtp_from_address', env('MAIL_FROM_NAME')),
                    'smtp_rate_limit' => config('system.smtp_rate_limit', 30),
                ],
                'site' => [
                    'logo' => config('system.logo'),
                    'safe_mode_enable' => (int) config('system.safe_mode_enable', 0),
                    'stop_register' => (int) config('system.stop_register', 0),
                    'email_verify' => (int) config('system.email_verify', 0),
                    'app_name' => config('system.app_name', env('APP_NAME')),
                    'app_url' => config('system.app_url', env('APP_URL')),
                    'recaptcha_enable' => (int) config('system.recaptcha_enable', 0),
                    'recaptcha_site_key' => config('system.recaptcha_key',env('GOOGLE_RECAPTCHA_SITE_KEY')),
                    'recaptcha_secret' => config('system.recaptcha_secret', env('GOOGLE_RECAPTCHA_SECRET')),
                ],
                'telegram' => [
                    'telegram_bot_enable' => config('system.telegram_bot_enable', 0),
                    'telegram_bot_token' => config('system.telegram_bot_token'),
                ],
            ];
            $options = [
                'disk' => [
                    'local',
                    'nextcloud'
                ],
                'smtp_template' => [
                    'default',
                ]
            ];
            return response()->json([
                'status' => 'success',
                'content' => [
                    'settings' => $settings,
                    'options' => $options,
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * Store a newly created resource in storage.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function save(Request $request)
    {
        $data = $request->all();
        try {
            foreach ($request->all() as $key => $value) {
                $array[$key] = $value;
            }
            $data = var_export($array, 1);
            File::put(base_path() . '/config/system.php', "<?php\n return $data ;");
            Artisan::call('config:cache');
            return response()->json([
                'status' => 'success',
                'message' => trans('res.update.success'),
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.update.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }
    /**
     * Update the specified resource in storage.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param object $request
     *
     * @return \Illuminate\Http\Response
     */
    public function update(AddSettingRequest $request, $id)
    {

    }
    /**
     * Remove the specified resource from storage.
     * @method delete
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

    }
}
