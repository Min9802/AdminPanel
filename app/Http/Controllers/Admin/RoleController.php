<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddRoleRequest;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    /**
     * Create a new RoleController instance.
     *
     * @return void
     */
    private $role;
    private $permission;
    public function __construct(Role $role, Permission $permission)
    {
        $this->role = $role;
        $this->permission = $permission;
    }
    /**
     * Display a listing of the resource.
     * @method get
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $roles = $this->role->with('Permissions')->get();
            return response()->json([
                'status' => 'success',
                'content' => $roles,
            ]);
        }catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ];
            return response()->json($data, 500);
        }

    }

    /**
     * Store a newly created resource in storage.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AddRoleRequest $request)
    {
        $data = [
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ];
        try {
            DB::beginTransaction();
            $role = $this->role->create($data);
            $role->syncPermissions($request->permissions);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.add.success'),
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.add.fail'),
            ], 500);

        }
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param object $request
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $role = $this->role->find($id);
        $data = [
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'status' => $request->status,
        ];
        if (!$role) {
            $data = [
                'status' => 'error',
                'message' => trans('res.notfound'),
            ];
            return response()->json($data, 404);
        }
        try {
            DB::beginTransaction();
            $role->update($data);
            $role->syncPermissions($request->permissions);
            DB::commit();
            $dataRes = [
                'status' => 'success',
                'message' => trans('res.update.success'),
            ];
            return response()->json($dataRes);

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
     * Remove the specified resource from storage.
     * @method delete
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $roleDel = $this->role->find($id);
        if (!$roleDel) {
            $data = [
                'status' => 'error',
                'message' => trans('res.notfound'),
            ];
            return response()->json($data, 404);
        }
        try {
            DB::beginTransaction();
            $roleDel->syncPermissions([]);
            $roleDel->delete();
            DB::commit();
            $dataRes = [
                'status' => 'success',
                'message' => trans('res.delete.success'),
            ];
            return response()->json($dataRes);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.delete.fail'),
            ];
            return response()->json($data, 500);
        }

    }
}
