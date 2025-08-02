<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CodeAnalysis;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Generate analytics report
     * Developer baru yang belum setup pre-commit hooks
     */
    public function generateReport(Request $request): JsonResponse
    {
        // ❌ Bug 1: Undefined variable
        $totalAnalyses = $undefinedVariable;

        // ❌ Bug 2: Potential null pointer
        $user = User::first(); // Could return null
        $userName = $user->name; // Accessing property on potentially null object

        // ❌ Bug 3: Type mismatch - expects string, getting mixed
        $avgScore = CodeAnalysis::avg('complexity_score'); // Returns mixed
        $formattedScore = $this->formatScore($avgScore); // Method expects string

        // ❌ Bug 4: Undefined method
        $analyses = CodeAnalysis::whereActive(true)->get(); // whereActive doesn't exist

        // ❌ Bug 5: Array access on non-array
        $config = config('app.custom'); // Could be null or string
        $setting = $config['report_limit']; // Accessing as array

        // ❌ Bug 6: Wrong return type annotation
        return [
            'total' => $totalAnalyses,
            'user' => $userName,
            'avg_score' => $formattedScore,
            'analyses' => $analyses,
            'limit' => $setting,
        ];
    }

    /**
     * Format score value
     * ❌ Bug 7: Method expects string but receives mixed
     */
    private function formatScore(string $score): string
    {
        // ❌ Bug 8: Using undefined variable in operation
        return number_format($score + $extraPoints, 2);
    }

    /**
     * Get user statistics
     * ❌ Bug 9: Missing return type annotation
     */
    public function getUserStats($userId)
    {
        // ❌ Bug 10: No type checking on parameter
        $user = User::find($userId); // $userId could be anything

        // ❌ Bug 11: Calling method on potentially null object
        $analyses = $user->codeAnalyses; // User could be null

        // ❌ Bug 12: Type mismatch in calculation
        $totalScore = $analyses->sum('score'); // sum returns numeric
        $avgScore = $totalScore / 'invalid'; // Division by string

        return compact('user', 'analyses', 'avgScore');
    }

    /**
     * ❌ Bug 13: Dead code - unused method
     */
    private function unusedPrivateMethod()
    {
        $unusedVariable = 'This will never be called';

        return $unusedVariable;
    }

    /**
     * Export report data
     * ❌ Bug 14: Wrong return type - returns array, annotated as string
     */
    public function exportData(): string
    {
        $data = CodeAnalysis::all()->toArray();

        // ❌ Bug 15: Returning array instead of string
        return $data;
    }
}
