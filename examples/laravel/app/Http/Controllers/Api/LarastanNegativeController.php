<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LarastanNegativeController extends Controller
{
    public function index(): JsonResponse
    {
        // Type mismatch - returning string instead of JsonResponse
        return 'This should be JsonResponse';
    }

    public function show($id)
    {
        // Missing type hints
        $user = User::find($id);

        // Potential null pointer - calling method on potentially null object
        return $user->toArray();
    }

    public function update(Request $request, $id): JsonResponse
    {
        // Undefined variable usage
        $data = $request->all();

        // Wrong array key access
        $name = $undefinedVariable['name'];

        // Type mismatch in array
        $users = [
            'user1' => new User(),
            'user2' => 'This should be User object',
            'user3' => 12345,
        ];

        return response()->json(['success' => true]);
    }

    public function create(): array
    {
        // Calling non-existent method
        $result = $this->nonExistentMethod();

        // Wrong return type - method should return array but returning object
        return new User();
    }

    public function delete($id)
    {
        // Missing return type
        $user = User::find($id);

        // Comparing different types
        if ($user->id === 'string_id') {
            return true;
        }

        // Dead code - unreachable
        $user->delete();

        return false;
    }

    private function processData($data)
    {
        // Missing parameter and return types
        // Accessing property that doesn't exist
        return $data->nonExistentProperty;
    }
}
