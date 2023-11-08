<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AttributeRequest;
use App\Models\Admin\Attribute;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
class AttributeController extends Controller
{
    /**
     * Create a new PackageController instance.
     *
     * @return void
     */
    private $attribute;
    public function __construct(Attribute $attribute)
    {
        $this->attribute = $attribute;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $attributes = $this->attribute->with('products')->get();
            return response()->json([
                'status' => 'success',
                'content' => $attributes,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    public function get()
    {
        try {
            $attributes = $this->attribute->where('status',1)->get();
            return response()->json([
                'status' => 'success',
                'content' => $attributes,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * store attribute.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AttributeRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'name' => Str::lower($request->name),
                'status' => $request->status,
            ];
            $attribute_created = $this->attribute->create($data);
            DB::commit();
            return response()->json([
                'status' =>'success',
                'message' => trans('res.add.success'),
                'content' => $attribute_created,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.add.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * update attribute.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, AttributeRequest $request)
    {
        try {
            $attribute = $this->attribute->find($id);
            if(!$attribute){
                return response()->json([
                   'status' => 'error',
                   'message' => trans('res.getdata.fail'),
                ], 500);
            }
            DB::beginTransaction();
            $data = [
                'name' => Str::lower($request->name),
                'status' => $request->status,
            ];
            $attribute_update = $this->attribute->find($id)->update($data);
            DB::commit();
            return response()->json([
                'status' =>'success',
                'message' => trans('res.update.success'),
                'content' => $attribute_update,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.update.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * change status attribute.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function status($id)
    {
        try {
            $attribute = $this->attribute->find($id);
            if(!$attribute){
                return response()->json([
                   'status' => 'error',
                   'message' => trans('res.notfound'),
                ], 404);
            }
            DB::beginTransaction();
            $attribute->status = !$attribute->status;
            $attribute->save();
            DB::commit();
            return response()->json([
                'status' =>'success',
                'message' => trans('res.update.success'),
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.update.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * destroy attribute.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $attribute = $this->attribute->find($id);
        if (!$attribute) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ], 404);
        }
         try{
            DB::beginTransaction();
            $attribute->delete();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.delete.success'),
            ]);
        }catch(Exception $e){
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.delete.fail'),
            ], 500);
        }
    }
    /**
     * get trash attribute.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function trash()
    {
        try{
            $trashs = $this->attribute->onlyTrashed()->get();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.getdata.success'),
                'content' => $trashs
            ]);
        }catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.getdataa.fail'),
            ], 500);
        }
    }
    /**
     * restore attribute.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        try{
            DB::beginTransaction();
            $trash = $this->attribute->onlyTrashed()->find($id);
            if(!$trash){
                return response()->json([
                    'status' => 'error',
                    'message' => trans('res.notfound'),
                ]);
            }
            $trash->restore();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.restore.success'),
            ]);
        }catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.restore.fail'),
            ], 500);
        }
    }
    /**
     * force delete attribute.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function forceDelete($id)
    {
        try{
            DB::beginTransaction();
            $trash = $this->attribute->onlyTrashed()->find($id);
            if(!$trash){
                return response()->json([
                    'status' => 'error',
                    'message' => trans('res.notfound'),
                ]);
            }
            $trash->forceDelete();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.forceDelete.success'),
            ]);
        }catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.forceDelete.fail'),
            ], 500);
        }
    }
}
