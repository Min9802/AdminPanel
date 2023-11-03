<?php

namespace Min\Storage;

abstract class FileAbtract
{
    protected $config;
    abstract public function list();
    abstract public function get($hashname);

    abstract public function upload($file);
    abstract public function update($fileSelect, $file);

    abstract public function delete($file);
    abstract public function forceDelete($file);

}
