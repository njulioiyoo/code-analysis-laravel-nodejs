<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CodeAnalysis;
use Illuminate\Http\Request;

/**
 * File untuk test kemampuan detection Larastan
 * Sengaja dibuat dengan berbagai jenis bugs
 */
class LarastanTestController extends Controller
{
    // BUG 1: Undefined variable (Level 1)
    public function bug1()
    {
        return $undefinedVariable;
    }

    // BUG 2: Wrong return type (Level 2)
    public function bug2(): string
    {
        return 123; // Should return string
    }

    // BUG 3: Undefined property (Level 3)
    public function bug3()
    {
        $obj = new \stdClass();
        return $obj->nonExistentProperty;
    }

    // BUG 4: Array key without check (Level 4)
    public function bug4(Request $request)
    {
        $data = $request->all();
        return $data['definitely_missing_key']; // Might not exist
    }

    // BUG 5: Null handling issue (Level 5)
    public function bug5(): string
    {
        $analysis = CodeAnalysis::first(); // Could be null
        return $analysis->name; // Null pointer exception
    }

    // BUG 6: Type inconsistency (Level 6)
    public function bug6($value)
    {
        $variable = 'string';
        if (rand(0, 1)) {
            $variable = 123; // Type changes from string to int
        }
        return strlen($variable); // Might be int, strlen needs string
    }

    // BUG 7: Collection type mismatch (Level 7)
    public function bug7()
    {
        $numbers = collect([1, 2, 3, 4, 5]);
        $numbers->push('string'); // Adding string to number collection
        return $numbers->sum(); // Sum might fail with mixed types
    }

    // BUG 8: Dead code / impossible condition (Level 8)
    public function bug8(string $value)
    {
        if (is_string($value)) {
            // Some logic
        }
        
        if (is_int($value)) { // This will never be true!
            return 'unreachable code';
        }
        
        return $value;
    }

    // BUG 9: Missing type annotations (Level 9)
    public function bug9($param) // No type hint
    {
        return $this->processData($param); // No return type
    }

    private function processData($data) // No type hints
    {
        return $data;
    }

    // BUG 10: Complex real-world scenario
    public function realWorldBug(Request $request)
    {
        // Multiple potential issues
        $filters = $request->get('filters'); // Could be null
        $page = $request->input('page', 1); // Could be string
        
        // Array access without check
        $status = $filters['status']; // filters might be null, key might not exist
        
        // Type assumption
        $perPage = $page * 10; // page might be string, math operation
        
        // Database query issues
        $query = CodeAnalysis::query();
        
        if ($status) {
            $query->where('status', $status);
        }
        
        // Round function with mixed type (same bug as original)
        $avgScore = $query->avg('complexity_score');
        $roundedScore = round($avgScore, 2); // avgScore could be null
        
        return [
            'data' => $query->paginate($perPage),
            'average_score' => $roundedScore,
            'filters_applied' => $filters,
        ];
    }

    // BUG 11: Laravel-specific issues
    public function laravelSpecificBugs()
    {
        // Model method that doesn't exist
        $analysis = CodeAnalysis::findByComplexity(5); // Method doesn't exist
        
        // Wrong relationship call
        $user = $analysis->author; // Relationship might not be defined
        
        // Collection method misuse
        $analyses = CodeAnalysis::all();
        $filtered = $analyses->filterBy('status', 'completed'); // Method doesn't exist
        
        return $filtered;
    }

    // CORRECT VERSION: How it should be written
    public function correctVersion(Request $request): array
    {
        $filters = $request->get('filters', []);
        $page = (int) $request->input('page', 1);
        
        $status = is_array($filters) && isset($filters['status']) 
            ? $filters['status'] 
            : null;
        
        $perPage = max(1, min(100, $page * 10)); // Validate range
        
        $query = CodeAnalysis::query();
        
        if ($status !== null) {
            $query->where('status', $status);
        }
        
        $avgScore = $query->avg('complexity_score');
        $roundedScore = $avgScore !== null ? round((float) $avgScore, 2) : null;
        
        return [
            'data' => $query->paginate($perPage),
            'average_score' => $roundedScore,
            'filters_applied' => $filters,
        ];
    }
}