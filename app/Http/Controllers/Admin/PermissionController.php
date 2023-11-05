<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddPermissionRequest;
use Exception;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Create a new PermissionController instance.
     *
     * @return void
     */
    private $permission;
    private $role;
    public function __construct(Role $role, Permission $permission)
    {
        $this->permission = $permission;
        $this->role = $role;
    }
    /**
     * Display a listing of the resource.
     * @method get
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $permissions = $this->permission->all();
        if ($permissions->count() == 0) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ], 500);

        }
        return response()->json([
            'status' => 'success',
            'content' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * @method post
     * @param object $request
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AddPermissionRequest $request)
    {
        try{
            DB::beginTransaction();
            // $data = [
            //     'name' => $request->name
            // ];
            foreach($request->name as $permission){
                $this->permission->create([
                    'name' => $permission
                ]);
            }
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.save.success'),
            ], 200);
        }catch(Exception $e){
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.add.fail'),
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  object $request
     *
     * @return \Illuminate\Http\Response
     */
    public function update(AddPermissionRequest $request, $id)
    {
        try{
            DB::beginTransaction();
            $permission = $this->permission->find($id);
            if(!$permission){
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.notfound'),
                ], 404);
            }
            $permission->update([
                'name' => $request->name
            ]);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.update.success'),
            ], 200);
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $permission = $this->permission->find($id);
            if (!$permission) {
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.notfound'),
                ], 404);
            }
            $this->role->revokePermissionTo($permission->name);
            $permission->delete();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.delete.success'),
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.delete.fail'),
            ], 500);
        }
    }
}
