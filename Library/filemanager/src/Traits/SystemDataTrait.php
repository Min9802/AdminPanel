<?php

namespace Min\FileManager\Traits;

use Min\FileManager\Models\FileSystem;
use Min\FileManager\Models\ShareFile;
use Illuminate\Support\Facades\Log;
use Min\FileManager\Models\FileShare;

trait SystemDataTrait
{
    /**
     * save to DB
     * @param $data
     * @return ArrayObject
     */
    public function SaveToDB($data)
    {
        try{
            $dataCreated = FileSystem::updateOrCreate(
                [ "path" => $data['path']],
                [
                    "user_id" => auth()->guard('admin')->user()->id ?? 1,
                    "disk" => $data['disk'],
                    "type" => $data['type'],
                    "basename" => $data['basename'],
                    "dirname" => $data['dirname'],
                    "extension" => $data['extension'],
                    "filename" => $data['filename'],
                    "size" => $data['size'],
                    "timestamp" => $data['timestamp'],
                    "visibility" => $data['visibility'] || 'private',
                ]
            );
            return $dataCreated;
        }catch(\Exception $e){
            Log::error('error save file to DB :' . $e->getMessage() . '--line: ' . $e->getLine());
        }
    }
    /**
     * create share
     * @param $path
     * @param $data
     */
    public function addShare($path, $data)
    {
        $file = FileSystem::where('path',$path)->first();
        $dataSync = [
            'share_id' => $data['id'],
            'url' => $data['url'],
        ];
        if($file){
           $file->shares()->create($dataSync);
        }
    }
    /**
     * delete share
     * @param $id
     */
    public function removeShare($id)
    {
        $share = FileShare::where('share_id',$id)->first();
        if($share){
            $share->delete();
        }
        return true;
    }
    /**
     * get info
     * @param $disk
     * @param $path
     */
    public function GetInfo($disk, $path) {
        $info = FileSystem::where('disk',$disk)->where('path', $path)->first();
        if(!$info){
            return false;
        }else{
            return $info;
        }
    }
}
