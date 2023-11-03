<?php

return [
    'token' => '/api/oauth/token',
    'option' => [
        'file' => [
            'list' => '/api/storage/client/file/list/',
            'get' => '/api/storage/client/file/get/',
            'mimeType' => '/api/storage/client/file/mimeType/',
            'stream' => '/api/storage/client/file/stream',
            'upload' => '/api/storage/client/file/upload/',
            'rename' => '/api/storage/client/file/rename/',
            'move' => '/api/storage/client/file/move/',
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
            'exists' => '/api/storage/client/folder/exists/',
            'create' => '/api/storage/client/folder/create/',
            'rename' => '/api/storage/client/folder/rename/',
            'getfile' => '/api/storage/client/folder/getfile/',
            'delete' => '/api/storage/client/folder/delete/',
        ],
    ],
    'config' => [
        'uri' => config('system.msv_client', env('STORAGE_SERVICE_CLIENT_URI')),
        'client_id' => config('system.msv_client_id', env('STORAGE_SERVICE_CLIENT_ID')),
        'client_secret' => config('system.msv_client_secret', env('STORAGE_SERVICE_CLIENT_SECRET')),
    ],
];
