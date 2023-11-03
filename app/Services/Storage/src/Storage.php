<?php
namespace Min\Storage;

abstract class Storage
{
    protected $config;
    abstract function upload($file);
    abstract function update($fileSelect, $file);
    abstract function allfile();
    abstract function getfile($hashname);
    abstract function delete($file);
    abstract function trash();
    abstract function restore($file);
    abstract function forceDelete($file);

}
