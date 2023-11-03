<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Laravel\Passport\ClientRepository;
class ClientPassport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:passport
            {--admin : client Admin}
            {--user : client User}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Client Passport';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if($this->option('user')){
            $this->UserClient();
        }
        if($this->option('admin')){
            $this->AdminClient();
        }

    }
    public function AdminClient()
    {
        $clientRepo =  App::make(ClientRepository::class);
        $client = $clientRepo->create(1, "Auth", '',"admins",false, true);
        $client_id = $client->id;
        $client_Secret = $client->secret;
        $this->info("client_id: " . $client_id);
        $this->info("client_Secret: " . $client_Secret);
        return Command::SUCCESS;
    }
    public function UserClient()
    {
        $clientRepo =  App::make(ClientRepository::class);
        $client = $clientRepo->create(1, "Auth", '',"users",false, true);
        $client_id = $client->id;
        $client_Secret = $client->secret;
        $this->info("client_id: " . $client_id);
        $this->info("client_Secret: " . $client_Secret);
        return Command::SUCCESS;
    }
}
