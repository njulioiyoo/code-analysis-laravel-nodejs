<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class TestCleanController extends Controller
{
    /**
     * Get user name safely with null checking
     */
    public function getUserName(int $userId): JsonResponse
    {
        $user = User::find($userId);

        if ($user === null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json(['name' => $user->name]);
    }

    /**
     * Calculate average with proper type handling
     */
    public function calculateAverage(string $numberString): JsonResponse
    {
        $number = (float) $numberString;
        $average = round($number, 2);

        return response()->json(['average' => $average]);
    }

    /**
     * Safe array access with key checking
     *
     * @param  array<string, mixed>  $data
     */
    public function getDataValue(array $data): JsonResponse
    {
        if (! array_key_exists('required_key', $data)) {
            return response()->json(['error' => 'Required key not found'], 400);
        }

        return response()->json(['value' => $data['required_key']]);
    }

    /**
     * Safe method call with type checking
     */
    public function callUserMethod(User $user): JsonResponse
    {
        return response()->json(['id' => $user->id, 'name' => $user->name]);
    }
}
