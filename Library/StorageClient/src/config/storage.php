<?php
return [
    'msv' => [
        'driver' => 'msv',
        'uri' => env('STORAGE_SERVICE_CLIENT_URI'),
        'clientId' => env('STORAGE_SERVICE_CLIENT_ID'),
        'clientSecret' => env('STORAGE_SERVICE_CLIENT_SECRET'),
        'scope' => 'storage',
    ],
];
