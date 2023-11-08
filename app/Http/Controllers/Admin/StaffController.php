<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Helper;
use App\Http\Requests\Admin\AddStaffRequest;
use App\Models\Admin\Admin;
use Illuminate\Support\Facades\Hash;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StaffController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    private $admin;
    public function __construct(Admin $admin)
    {
        $this->admin = $admin;
    }
    /**
     * Display a listing of the resource.
     * @method get
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $staffs = $this->admin->with('roles')->get();
            return response()->json([
                'status' => 'success',
                'content' => $staffs,
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
     * Store a newly created resource in storage.
     * @method  post
     * @param object $request
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AddStaffRequest $request)
    {
        $passRand = Helper::random('ok', 6);
        $data = [
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($passRand),
        ];
        try{
            DB::beginTransaction();
            $staff = $this->admin->create($data);
            $staff->roles($request->roles);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => [
                    trans('res.add.success'),
                    trans('res.password') . $passRand
                ],
                'content' => $staff,
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
     *
     * @param  \Illuminate\Http\Request  $request
     * @method patch
     * @param  int  $id
     * @param object $request
     * @return \Illuminate\Http\Response
     */
    public function update(AddStaffRequest $request, $id)
    {
        $staff = $this->admin->find($id);
        if (!$staff) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ], 404);
        }
        if ($request->password != '') {
            $data = [
                'username' => $request->username,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ];
            $res = [
                'status' => 'success',
                'message' => [
                    trans('res.update.success') .' - ' .
                    trans('res.password') . $request->password

                ],
            ];
        } else {
            $data = [
                'username' => $request->username,
                'name' => $request->name,
                'email' => $request->email,
            ];
            $res = [
                'status' => 'success',
                'message' => trans('res.update.success'),
            ];
        }
        try{
            DB::beginTransaction();
            $staff->update($data);
            $staff = $this->admin->find($id);
            $staff->syncRoles($request->roles);
            DB::commit();
            return response()->json($res);
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
     * @method delete
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $staff = $this->admin->find($id);
        if (!$staff) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ], 404);
        }
        try{
            DB::beginTransaction();
            $staff->assignRole([]);
            $staff->delete();
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
     * change status banned
     * @method delete
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function status($id)
    {
        $staff = $this->admin->find($id);
        if (!$staff) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ], 404);
        }
        try {
            DB::beginTransaction();
            $staff->banned = !$staff->banned;
            $staff->save();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => trans('res.update.success'),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.update.fail'),
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
            $trashs = $this->admin->with('roles')->onlyTrashed()->get();
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
            $trash = $this->admin->onlyTrashed()->find($id);
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
            $trash = $this->admin->onlyTrashed()->find($id);
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
