<?php

return [
    'token' => '/api/oauth/token',
    'option' => [
        'file' => [
            'list' => '/api/storage/client/file/list/',
            'get' => '/api/storage/client/file/get/',
            'upload' => '/api/storage/client/file/upload/',
            'update' => '/api/storage/client/file/update/',
            'delete' => '/api/storage/client/file/delete/',
            'forcedelete' => '/api/storage/client/file/forcedelete/',
        ],
        'trash' => [
            'list' => '/api/storage/client/trash/list/',
            'delete' => '/api/storage/client/trash/delete/',
            'clear' => '/api/storage/client/trash/clear/',
            'restore' => '/api/storage/client/trash/restore/',
        ],
        'folder' => [
            'list' => '/api/storage/client/folder/list/',
            'create' => '/api/storage/client/folder/create/',
            'delete' => '/api/storage/client/folder/delete/',
            'rename' => '/api/storage/client/folder/rename/',
        ],
    ],
    'client' => [
        'uri' => config('system.msv_client', env('STORAGE_SERVICE_CLIENT_URI')),
        'client_id' => config('system.msv_client_id', env('STORAGE_SERVICE_CLIENT_ID')),
        'client_secret' => config('system.msv_client_secret', env('STORAGE_SERVICE_CLIENT_SECRET')),
    ],
];
