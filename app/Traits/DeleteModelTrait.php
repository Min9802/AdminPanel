<?php
namespace App\Traits;

use App\Models\UploadFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

trait DeleteModelTrait{
    public function deleteModelTrait($id, $model)
    {
        try{
            $model->find($id)->delete();
            $data = [
                'code'  => 200,
                'message' => "success"
            ];
            return response()->json($data);
        }catch (\Exception $exception) {
            Log::error('Message:' . $exception->getMessage() . '---Line' . $exception->getLine());
            $data = [
                'code'  => 500,
                'message' => "fail"
            ];
            return response()->json($data);
        }
    }
}
?>
