<?php
namespace Min\Storage;

abstract class FolderAbtract
{
    protected $config;

    abstract public function list();
    abstract public function create($name);
    abstract public function delete($name);

}
