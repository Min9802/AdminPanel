<?php

namespace App\Console\Commands;

use App\Models\Admin\Admin;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Encryption\Encrypter;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class Install extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install Panel';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            $this->info("  __        __                   ______                                  _  ");
            $this->info(" |  \      /  |                 |  ___  \                               | | ");
            $this->info(" |   \    /   |  _   _ _____    | |   \  \  ____ _   _ ____     ______  | | ");
            $this->info(" | |\ \  / /| | | | / '___  \   | |    | | /  __` | /  ___  \  / ___  \ | | ");
            $this->info(" | | \ \/ / | | | | | /   | |   | |___/  //  /  | | | /   | | | (___| | | | ");
            $this->info(" | |  \_/   | | | | | |   | |   |  _____/ | |   | | | |   | | |  _____/ | | ");
            $this->info(" | |        | | | | | |   | |   | |       | \___/ | | |   | | | |_____  | | ");
            $this->info(" |_|        |_| |_| |_|   |_|   |_|        \__,___| |_|   |_|  \______| |_| ");

            if (File::exists(base_path() . '/.env')) {
                abort(500, 'Panel installed, if reinstall, Please delete file .env in root folder !');
            }
            if (!copy(base_path() . '/.env.example', base_path() . '/.env')) {
                abort(500, "can't copy file environment, Please check permission folder root !");
            }
            $this->saveToEnv([
                'APP_KEY' => 'base64:' . base64_encode(Encrypter::generateKey('AES-256-CBC')),
                'APP_URL' => $this->ask('Enter URL website (ex: http(s)://domain.com)'),
                'DB_HOST' => $this->ask('Enter database host (default: 127.0.0.1)', '127.0.0.1'),
                'DB_DATABASE' => $this->ask('Enter database name (default: laravel)','laravel'),
                'DB_USERNAME' => $this->ask('Enter database username (default: root)','root'),
                'DB_PASSWORD' => $this->ask('Enter password database (default: null)',''),
            ]);
            Artisan::call('config:cache');
            Artisan::call('migrate:fresh');
            Artisan::call('db:seed --class=RolePermissionSeeder');
            $this->info('Nhập cơ sở dữ liệu hoàn tất');

            $defauAdmin = $this->ask('Manually type the administrator account (Y or N)', 'N');
            if ($defauAdmin == "Y") {
                $username = '';
                $email = '';
                $password = '';
                while (!$username) {
                    $username = $this->ask('Enter username Admin');
                }
                while (!$email) {
                    $email = $this->ask('Enter email Admin');
                }
                while (!$password) {
                    $password = $this->ask('Enter password Admin');
                }
                if (!$this->registerAdmin($username, $email, $password)) {
                    abort(500, 'Generate Admin account failed, Please try again');
                }
                $this->info('All already');
                $this->info('Admin Account: '. $username . ' password: ' . $password);
                $this->info('Access http(s)://your-domain/admin to dashboard');
            } else {
                Artisan::call("migrate --seed");
                $this->info('All already');
                $this->info('Admin Account: Admin password: Admin');
                $this->info('Access http(s)://your-domain/admin to dashboard');
            }

        } catch (Exception $e) {
            $this->error($e->getMessage());
        }
    }
    private function registerAdmin($username, $email, $password)
    {
        $user = new Admin();
        $user->username = $username;
        $user->name = $username;
        $user->email = $email;
        if (strlen($password) < 8) {
            abort(500, 'Password length minimum 8 character');
        }
        $user->password = Hash::make($password);
        return $user->save();

    }
    private function saveToEnv($data = [])
    {
        function set_env_var($key, $value)
        {
            if (!is_bool(strpos($value, ' '))) {
                $value = '"' . $value . '"';
            }
            $key = strtoupper($key);

            $envPath = app()->environmentFilePath();
            $contents = file_get_contents($envPath);

            preg_match("/^{$key}=[^\r\n]*/m", $contents, $matches);

            $oldValue = count($matches) ? $matches[0] : '';

            if ($oldValue) {
                $contents = str_replace("{$oldValue}", "{$key}={$value}", $contents);
            } else {
                $contents = $contents . "\n{$key}={$value}\n";
            }

            $file = fopen($envPath, 'w');
            fwrite($file, $contents);
            return fclose($file);
        }

        foreach ($data as $key => $value) {
            set_env_var($key, $value);
        }
        return true;
    }
}
