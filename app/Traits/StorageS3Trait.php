<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
trait StorageS3Trait
{
    public function s3Upload($request, $fieldName, $folderName)
    {
        if ($request->hasFile($fieldName)) {

            $file = $request->file($fieldName);
            $fileNameOrigin = $file->getClientOriginalName();
            // $size = $file->get;
            $path = Storage::disk('s3')->put('storage/'.$folderName, $file, 'public'.$folderName);
            $url = 'https://quangblue.s3.ap-east-1.amazonaws.com/';

            $fullpath = Storage::disk('s3')->url($path);

            $path = Str::after($fullpath, $url);

            $dataUploadTrait = [
                'file_name' => $fileNameOrigin,
                'file_path' =>  $path,
            ];
            return $dataUploadTrait;
        }
        return null;
    }
    public function getfile($filepath)
    {   
        $disk = Storage::disk('s3');

        if (Storage::disk('s3')->exists($filepath)) {
            $file = $disk->url($filepath);
            return $file;
        }
        return null;

    }
    public function delFile($filepath)
    {
        Storage::disk('s3')->delete($filepath);
    }
}
