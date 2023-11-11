<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Admin Panel Laravel 9 reactjs 18
Admin template build with reactjs 18 & Laravel 9
## Require 
- PHP 8.*+
- Composer
- MySQL 5.5+
- Redis
- Laravel
## PHP extension
- redis
- file info
## Install 
- install package composer
```
composer install
```
- install package npm
```
npm install
```
- install panel
```
php artisan install
```
## URL rewrite nginx
```
location /public {
}

location / {  
    try_files $uri $uri/ /index.php$is_args$query_string;  
}

location ~ .*\.(js|css)?$
{
    expires      1h;
    error_log off;
    access_log /dev/null; 
}
```
## URL rewrite Apache
```
<IfModule mod_rewrite.c>
    RewriteEngine On

    RewriteCond %{REQUEST_FILENAME} -d [OR]
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ ^$1 [N]

    RewriteCond %{REQUEST_URI} (\.\w+$) [NC]
    RewriteRule ^(.*)$ public/$1

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ server.php

</IfModule>
```
## build and test
- open terminal and type
### test 
```
php artisan server
```
```
npm run watch
```
### build
```
npm run prod
```
## Cron job
```
php /**path_to_dir_web**/artisan queue:work
```
```
php /**path_to_dir_web**/artisan schedule:run
```



