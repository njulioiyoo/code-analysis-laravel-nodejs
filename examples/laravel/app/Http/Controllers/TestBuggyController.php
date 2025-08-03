<?php

namespace App\Http\Controllers;

use App\Models\User;

class TestBuggyController extends Controller
{
    public function testNullPointer($userId)
    {
        // ❌ BUG: Potential null pointer - User::find can return null
        $user = User::find($userId);

        return $user->name; // This will crash if $user is null!
    }

    public function testUndefinedVariable()
    {
        // ❌ BUG: Undefined variable
        return $undefinedVariable; // This variable is not defined
    }

    public function testWrongTypeParameter()
    {
        // ❌ BUG: Wrong parameter type
        $stringNumber = '10.5';

        return round($stringNumber, 2); // round expects numeric, got string
    }

    public function testArrayKeyAccess($data)
    {
        // ❌ BUG: Array key might not exist
        return $data['non_existent_key']; // Key might not exist
    }

    public function testMethodCall($user)
    {
        // ❌ BUG: Method might not exist
        return $user->nonExistentMethod(); // Method doesn't exist
    }
}
