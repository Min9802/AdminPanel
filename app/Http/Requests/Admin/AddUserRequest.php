<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|min:6|max:16|unique:users',
            'name' => 'required',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ];
    }
    public function messages()
    {
       return [
           'username.required' => "UserName required",
           'username.min' => 'UserName min 6 character',
           'username.max' => 'UserName max 16 character',
           'username.unique' => 'UserName have been taken!',
           'name.required' => 'Name required',
           'email.required' => "Email required",
           'email.email' => "Require email",
           'email.max' => "Email max 100 character",
           'email.unique' => "Email have been taken!",
           'password.required' => "Password required",
           'password.confirmed' => "Password not confirmed ",
           'password.min' => "Password min 6 character",
       ];
    }
}
