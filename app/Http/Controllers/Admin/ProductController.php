<?php

namespace App\Http\Controllers\Admin;

use App\Events\Admin\FileSystemEvent;
use App\Events\Admin\ProductEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddProductRequest;
use App\Models\Admin\Product;
use App\Traits\StorageFileTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    use StorageFileTrait;
    /**
     * Create a new ProductController instance.
     *
     * @return void
     */

    private $product;
    public function __construct(Product $product)
    {
        $this->product = $product;
    }
    /**
     * list Product.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        try {
            $products = $this->product->with('Details', 'Packages','images')->get();
            return response()->json([
                'status' => 'success',
                'content' => $products,
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
     * store Product.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(AddProductRequest $request)
    {
        try {
            DB::beginTransaction();
            $product_data = [
                'name' => $request->name,
                'display_name' => $request->display_name,
                'status' => $request->status == 'true' ? true : false ,
            ];
            $product = $this->product->create($product_data);
            if($request->hasFile('files')){
                $event = FileSystemEvent::dispatch('upload',$request->file('files'));
                $file_uploaded = $event[0];
                foreach ($file_uploaded as $file){
                    $arrayImage[] = $file->id;
                }
                $product->images()->attach($arrayImage);
            }
            $product_Details = [
                'product_id' => $product->id,
                'price' => (float) $request->price,
                'description' => $request->description,
            ];
            $product->Details()->create($product_Details);
            $product->Packages()->attach((array) explode(',', $request->package_id));
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.add.success'),
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.add.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * update Product.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AddProductRequest $request, $id)
    {
        $product = $this->product->find($id);
        if(!$product){
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ], 404);
        }
        try {
            DB::beginTransaction();
            $product_data = [
                'name' => $request->name,
                'display_name' => $request->display_name,
                'status' => (boolean) $request->status,
            ];
            $ids_img = (array) explode(',', $request->id_img);
            (array) $arrayUpload = [];
            if($request->hasFile('files')){
                $event = FileSystemEvent::dispatch('upload',$request->file('files'));
                $file_uploaded = $event[0];
                foreach ($file_uploaded as $file){
                    $arrayUpload[] = (string) $file->id;
                }
            }
            $arrayImage = array_merge($ids_img, $arrayUpload);

            $deleteImages = collect($product->images)->whereNotIn('id',$arrayImage);
            if($deleteImages){
                $event = FileSystemEvent::dispatch('delete', $deleteImages);
            }
            $product->update($product_data);
            $product->images()->sync($arrayImage);

            $product_Details = [
                'product_id' => $product->id,
                'price' => (float) $request->price,
                'description' => $request->description,
            ];

            $product->Details()->update($product_Details);
            $product->Packages()->sync((array) explode(',', $request->package_id));

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.update.success'),
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.update.fail'),
            ];
            return response()->json($data, 500);
        }

    }

    /**
     * update Product status.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function status($id)
    {
        $product = $this->product->find($id);
         if(!$product){
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound')
            ],404);
        }
        try {
            DB::beginTransaction();
            $product->status = !$product->status;
            $product->save();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.update.success')
            ]);
        }catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.update.fail'),
            ], 500);
        }

    }
    /**
     * delete Product.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = $this->product->find($id);
        if(!$product){
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound')
            ],404);
        }
        try{
            DB::beginTransaction();
            $images = collect($product->images);
            if(!$images->isEmpty()){
                FileSystemEvent::dispatch('delete', $images);
            }
            $product->images()->sync([]);
            $product->Packages()->sync([]);
            $product->delete();
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
     * trash Product.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function trash()
    {
        try{
            $trashs = $this->product->with('details')->onlyTrashed()->get();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.getdata.success'),
                'content' => $trashs
            ]);
        }catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ], 500);
        }
    }
    /**
     * restore Product.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        try{
            DB::beginTransaction();
            $trash = $this->product->onlyTrashed()->find($id);
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
            DB::rollback();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.restore.fail'),
            ], 500);
        }
    }
    /**
     * force delete Product.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function forceDelete($id)
    {
        try{
            DB::beginTransaction();
            $trash = $this->product->onlyTrashed()->find($id);
            if(!$trash){
                return response()->json([
                    'status' => 'error',
                    'message' => trans('res.notfound'),
                ]);
            }
            $trash->details()->forceDelete();
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
