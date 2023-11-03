<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePassRequest;
use App\Http\Requests\Admin\UpdateProfileRequest;
use Illuminate\Http\Request;
use App\Models\Admin\Admin;
use Illuminate\Support\Facades\Hash;
use App\Services\TwoFactorService;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;

class ProfileController extends Controller
{



    /**
     * Create a new ProfileController instance.
     *
     * @return void
     */
    private $admin;
    private $twoFactorService;
    public function __construct(Admin $admin, TwoFactorService $twoFactorService)
    {
        $this->admin = $admin;
        $this->twoFactorService = $twoFactorService;
    }

    /**
     * Display the specified resource.
     * @method get
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $admin = Auth::user();
        if(!$admin){
            return response()->json([
                'status' => 'error',
                'message' => trans('res.getdata.fail')
            ],404);
        }
         $roles = $admin->roles;
        foreach ($roles as $role){
            $role->Permissions;
        }
        return response()->json([
            'status' => 'success',
            'content' => $admin
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProfileRequest $request)
    {
        $data = [
            'email' => $request->email,
            'name' => $request->name,
        ];
        $id = auth()->guard('admin')->user()->id;


    }
     /**
     * Update password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param  string  $password
     * @return \Illuminate\Http\Response
     */
    public function changePass(UpdatePassRequest $request)
    {
        $id = Auth::user()->id;
        $admin = $this->admin->find($id)->update(
            ['password' => Hash::make($request->new_password)]
        );
        if(!$admin){
            return response()->json([
                'status' => 'error',
                'message' => trans('res.update.fail')
            ],500);
        }
        return response()->json([
            'status' => 'success',
            'message' => trans('res.update.success'),
            'content' => $admin,
        ], 201);
    }
     /**
     * Enable 2Fa.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getqrcode(Request $request)
    {
        $admin = Auth::user();
        $Qrcode  = $this->twoFactorService->generate($admin);
        return response()->json([
            'status' => 'success',
            'content' => [
                'image' => $Qrcode
            ]
        ]);
    }
}
