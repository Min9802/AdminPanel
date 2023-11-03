<?php

namespace App\Http\Controllers\Admin;

use App\Events\Admin\ActionFileEvent;
use App\Events\Admin\UpdateFileEvent;
use App\Events\Admin\UploadFileEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FileUploadRequest;
use Min\FileManager\Models\FileSystem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FileManagerController extends Controller
{
    /**
     * Create a new PackageController instance.
     *
     * @return void
     */
    private $filesystem;
    public function __construct(FileSystem $filesystem)
    {
        $this->filesystem = $filesystem;
    }
    /**
     * list File.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $roles = $admin->roles;
            if ($roles->contains('name', 'Admin')) {
                $files = $this->filesystem->with('shares')->paginate(10);

            } else {
                $files = $admin->files->with('shares');
            }
            return response()->json([
                'status' => 'success',
                'content' => $files,
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
    public function stream(Request $request)
    {
        try{
            $path = $request->path;
            $disk = config('system.disk');
            $file = $this->filesystem->where('path', $path)->first();
            return response()->json([
                'status' => 'success',
                'content' => $file
            ]);
        }catch(Exception $e){
            Log::error('Message stream :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ];
            return response()->json($data, 500);
        }
    }
    /**
     * store file.
     * @method post
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FileUploadRequest $request)
    {
        try {
            DB::beginTransaction();
            $file = $request->file('file');
            $folder = $request->folder;
            $event = UploadFileEvent::dispatch($folder, $file);
            DB::commit();
            $result = collect($event[1]);
            if ($result['status'] == true) {
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.add.success'),
                ]);
            } else {
                $data = [
                    'status' => 'error',
                    'message' => trans('res.add.fail'),
                ];
                return response()->json($data, 500);
            }
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
     * update file.
     * @method patch
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $fileSelect = $this->filesystem->find($id);
        if (!$fileSelect) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ]);
        }
        try {
            DB::beginTransaction();
            $fileUpload = $request->file('file');
            $event = UpdateFileEvent::dispatch($fileSelect, $fileUpload);
            DB::commit();
            $result = collect($event[1]);
            if ($result['status'] == true) {
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.update.success'),
                ]);
            } else {
                $data = [
                    'status' => 'error',
                    'message' => trans('res.update.fail'),
                ];
                return response()->json($data, 500);
            }

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message update :' . $e->getMessage() . '--line: ' . $e->getLine());
            $data = [
                'status' => 'error',
                'message' => trans('res.update.fail'),
            ];
            return response()->json($data, 500);
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
        $file = $this->filesystem->find($id);
        if (!$file) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ]);
        }
        $status = $file->status;
        switch ($status) {
            case 1:
                $statusUpdate = 0;
                break;
            case 0:
                $statusUpdate = 1;
                break;
        }
        try {
            DB::beginTransaction();
            $file->update([
                'status' => $statusUpdate,
            ]);
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
     * destroy file.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $fileSelect = $this->filesystem->find($id);
        if (!$fileSelect) {
            return response()->json([
                'status' => 'error',
                'message' => trans('res.notfound'),
            ]);
        }
        try {
            DB::beginTransaction();
            $event = ActionFileEvent::dispatch('delete', $fileSelect);
            $fileSelect->delete();

            DB::commit();
            $result = collect($event[1]);
            if ($result['status'] == true) {
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.delete.success'),
                ]);
            } else {
                $data = [
                    'status' => 'error',
                    'message' => trans('res.delete.fail'),
                ];
                return response()->json($data, 500);
            }

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
    /**
     * get trash file
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function trash()
    {
        try {
            $trashs = $this->filesystem->onlyTrashed()->paginate(10);
            return response()->json([
                'status' => 'success',
                'message' => trans('res.getdata.success'),
                'files' => $trashs,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.getdata.fail'),
            ], 500);
        }
    }
    /**
     * restore file.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        try {
            DB::beginTransaction();
            $trash = $this->filesystem->onlyTrashed()->find($id);
            if (!$trash) {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('res.notfound'),
                ]);
            }
            $event = ActionFileEvent::dispatch('restore', $trash);
            $trash->restore();
            DB::commit();
            $result = collect($event[1]);
            if ($result['status'] == true) {
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.restore.success'),
                ]);
            } else {
                $data = [
                    'status' => 'error',
                    'message' => trans('res.restore.fail'),
                ];
                return response()->json($data, 500);
            }
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.restore.fail'),
            ], 500);
        }
    }
    /**
     * forcedelete file.
     * @method delete
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function forceDelete($id)
    {
        try {
            DB::beginTransaction();
            $trash = $this->filesystem->onlyTrashed()->find($id);
            if (!$trash) {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('res.notfound'),
                ]);
            }
            $event = ActionFileEvent::dispatch('forceDelete', $trash);
            $trash->forceDelete();
            DB::commit();
            $result = collect($event[1]);
            if ($result['status'] == true) {
                return response()->json([
                    'status' => 'success',
                    'message' => trans('res.forceDelete.success'),
                ]);
            } else {
                $data = [
                    'status' => 'error',
                    'message' => trans('res.forceDelete.fail'),
                ];
                return response()->json($data, 500);
            }
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'status' => 'error',
                'message' => trans('res.forceDelete.fail'),
            ], 500);
        }
    }
    /**
     * get disk.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function disk()
    {
        try {
            $admin = auth()->guard('admin')->user();
            $disks = $admin->files()->get('disk')->pluck('disk')->unique()->toArray();
            return response()->json([
                'message' => trans('res.getdata.success'),
                'content' => $disks,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.getdata.fail'),
            ], 500);
        }
    }
    /**
     * get folder.
     * @method get
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function listFolder(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $folders = array_unique($admin->files()->where('disk',$request->disk)->get('folder')->pluck('folder')->toArray());
            return response()->json([
                'message' => trans('res.getdata.success'),
                'content' => $folders,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.getdata.fail'),
            ], 500);
        }
    }
    public function addFolder(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $name = $request->name;
            $event = $this->addFolder($name);
            return response()->json([
                'message' => trans('res.add.success'),
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.add.fail'),
            ], 500);
        }
    }
    public function listfile(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $name = $request->name;
            $files = $this->filesystem->where('folder', $name)->get();
            return response()->json([
                'message' => trans('res.getdata.success'),
                'content' => $files,
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.getdata.fail'),
            ], 500);
        }
    }
    public function updateFolder(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $name = $request->name;
            $newname = $request->newname;
            $config = config('system.disk', 'local');
            switch ($config) {
                case 'local':

                    $update = Storage::rename($name, $newname);
                    if($update){
                        $this->filesystem->where('folder', $name)->update('folder', $name);
                    }
                    break;
                case 'google':
                    $update = Storage::disk('google')->rename($name, $newname);
                    if($update){
                        $this->filesystem->where('folder', $name)->update('folder', $name);
                    }
                    break;
                case 'msv':
                    $update = Storage::disk('msv')->rename($name, $newname);
                    if($update){
                        $this->filesystem->where('folder', $name)->update('folder', $name);
                    }
                    break;
            }
            return response()->json([
                'message' => trans('res.update.success')
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.update.fail')
            ],500);
        }
    }
    public function destroyFolder(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $username = $admin->username;
            $name = $request->name;
            $config = config('system.disk', 'local');
            switch ($config) {
                case 'local':
                    $delete = Storage::move($name, $username.'/trash');
                    if($delete){
                        $this->filesystem->where('folder', $name)->delete();
                    }
                    break;
                case 'google':
                    $delete = Storage::disk('google')->move($name, 'trash');
                    if($delete){
                        $this->filesystem->where('folder', $name)->delete();
                    }
                    break;
                case 'msv':
                    $delete = Storage::disk('msv')->deleteDirectory($name);
                    if($delete){
                        $this->filesystem->where('folder', $name)->delete();
                    }
                    break;
            }
            return response()->json([
                'message' => trans('res.update.success')
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
        }
    }
    public function trashFolder()
    {
        try {
            $admin = auth()->guard('admin')->user();
            $trashFolders = $this->filesystem->onlyTrashed()->get();
            return response()->json([
                'message' => trans('res.getdata.success'),
                'content' => $trashFolders
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.getdata.fail'),
            ],500);
        }
    }
    public function restoreFolder(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $username = $admin->username;
            $config = config('system.disk', 'local');
            $name = $request->name;
            switch ($config) {
                case 'local':
                    $check  = Storage::directoryExists($username.'/trash/'. $name);
                    if($check){
                        $restore = Storage::move($username.'/trash/'. $name, $username.'/'.$name);
                        if($restore){
                            $this->filesystem->onlyTrashed()->where('folder',$name)->restore();
                        }
                    }
                    break;
                case 'google':
                    $check  = Storage::disk('google')->directoryExists('/trash/'. $name);
                    if($check){
                        $restore = Storage::move('/trash/'. $name, $name);
                        if($restore){
                            $this->filesystem->onlyTrashed()->where('folder',$name)->restore();
                        }
                    }
                    break;
                case 'msv':
                    $check  = Storage::disk('msv')->directoryExists('/trash/'. $name);
                    if($check){
                        $restore = Storage::disk('msv')->move('/trash/'. $name, $name);
                        if($restore){
                            $this->filesystem->onlyTrashed()->where('folder',$name)->restore();
                        }
                    }
                    break;
            }
            return response()->json([
                'message' => trans('res.restore.success')
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.restore.fail')
            ],500);
        }
    }
    public function forceDeleteFolder(Request $request)
    {
        try {
            $admin = auth()->guard('admin')->user();
            $username = $admin->username;
            $config = config('system.disk', 'local');
            $name = $request->name;
            switch ($config) {
                case 'local':
                    $check  = Storage::directoryExists($username.'/trash/'. $name);
                    if($check){
                        $restore = Storage::deleteDirectory($username.'/'. $name);
                        if($restore){
                            $this->filesystem->where('folder',$name)->forceDelete();
                        }
                    }
                    break;
                case 'google':
                    $check  = Storage::disk('google')->directoryExists('/trash/'. $name);
                    if($check){
                        $restore = Storage::deleteDirectory($name);
                        if($restore){
                            $this->filesystem->onlyTrashed()->where('folder',$name)->forceDelete();
                        }
                    }
                    break;
                case 'msv':
                    $check  = Storage::disk('msv')->directoryExists($name);
                    if($check){
                        $restore = Storage::disk('msv')->deleteDirectory($name);
                        if($restore){
                            $this->filesystem->onlyTrashed()->where('folder',$name)->forceDelete();
                        }
                    }
                    break;
            }
            return response()->json([
                'message' => trans('res.delete.success')
            ]);
        } catch (Exception $e) {
            Log::error('Message :' . $e->getMessage() . '--line: ' . $e->getLine());
            return response()->json([
                'message' => trans('res.delete.fail')
            ],500);
        }
    }

}
