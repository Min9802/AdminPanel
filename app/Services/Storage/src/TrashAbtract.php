<?php
namespace Min\Storage;

abstract class TrashAbtract
{
    protected $config;
    abstract function list();
    abstract function delete($file);
    abstract function clear();
    abstract function restore($file);
}
