<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\AddPackageRequest;
use App\Models\Admin\Package;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class PackageController extends Controller
{
     /**
     * Create a new PackageController instance.
     *
     * @return void
     */
    private $package;
    public function __construct(Package $package)
    {
        $this->package = $package;
    }
    /**
     * list Package.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
         try{
            $packages = $this->package->with('products')->get();
            return response()->json([
                'status' => 'success',
                'content' => $packages,
            ]);
        }catch(Exception $e){
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * store Package.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AddPackageRequest $request)
    {
        $data = [
            'name' => $request->name,
            'display_name' => $request->display_name,
            'status' => $request->status
        ];
        try{
            DB::beginTransaction();
            $this->package->create($data);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.add.success')
            ]);
        }catch(Exception $e){
             Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.add.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * update Package.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AddPackageRequest $request,$id)
    {
        $package = $this->package->find($id);
        $data = [
            'name' => $request->name,
            'display_name' => $request->display_name,
            'status' => $request->status
        ];

        if (!$package) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ], 404);
        }
        try{
            DB::beginTransaction();
            $package->update($data);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.update.success')
            ]);
        }catch(Exception $e){
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.update.fail'),
            ], 500);
        }
    }
    /**
     * update status.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function status($id)
    {
        $package = $this->package->find($id);
        if(!$package){
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound')
            ],404);
        }
        try {
            DB::beginTransaction();
            $package->status = !$package->status;
            $package->save();
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
     * destroy Package.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,$id)
    {
        $package = $this->package->find($id);
        if (!$package) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ], 404);
        }
         try{
            DB::beginTransaction();
            $package->delete();
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
     * trash Package.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function trash()
    {
        try{
            $trashs = $this->package->with('products')->onlyTrashed()->get();
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
     * restore Package.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        try{
            DB::beginTransaction();
            $trash = $this->package->onlyTrashed()->find($id);
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
     * force delete Package.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function forceDelete($id)
    {
        try{
            DB::beginTransaction();
            $trash = $this->package->onlyTrashed()->find($id);
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
