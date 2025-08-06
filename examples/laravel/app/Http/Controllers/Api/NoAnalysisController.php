<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoAnalysisController extends Controller
{
    public function index(): JsonResponse
    {
        // Intentionally messy code without using analysis tools
        $data = 'bad formatting here';
        $unused_variable = 'this is not used';

        // Return wrong type
        return "This should be JsonResponse but isn't";
    }

    public function show($id)
    {
        // No type hints, potential null issues
        $user = User::find($id);

        return $user->toArray(); // Potential null pointer
    }

    public function badFormatting(Request $request, $id): JsonResponse
    {
        // Terrible formatting, mixed quotes, undefined vars
        $data = $request->all();
        $name = $undefinedVar['name'];
        $result = $this->nonExistentMethod();

        // Array with inconsistent types
        $users = [
            'user1' => new User(),
            'user2' => 'string instead of User',
            'user3' => 123,
        ];

        return response()->json(['success' => true]);
    }

    public function create(): array
    {
        // Inconsistent spacing, wrong return type
        $user = new User();
        $unused = 'another unused variable';

        // Should return array but returns object
        return $user;
    }

    private function processData($data)
    {
        // Terrible formatting and accessing non-existent property
        return    $data->nonExistentProperty;
    }
}
