<?php

namespace App\Http\Controllers;

use App\Models\CodeAnalysis;

class TestNegativeScenarioController extends Controller
{
    public function testBuggyCode()
    {
        // Bug 1: Unused variable
        $unusedVariable = 'This variable is not used anywhere';

        // Bug 2: Undefined variable
        return response()->json($undefinedVariable);

        // Bug 3: Potential null pointer
        $analysis = CodeAnalysis::first();

        return $analysis->name; // Could be null

        // Bug 4: Type mismatch
        $score = 'not a number';

        return round($score, 2); // round expects number, got string

        // Bug 5: Wrong formatting (messy spacing)
        $data = ['test' => 'value',  'another' => 123];

        // Bug 6: Array access without check
        $request = request();

        return $request['missing_key']; // Could cause error
    }

    public function anotherBuggyMethod()
    {
        // Bug 7: Method parameter formatting issue
        $result = CodeAnalysis::where('status', 'active')->get();

        // Bug 8: Mixed return types
        if (true) {
            return 'string';
        } else {
            return 123; // Should be consistent return type
        }
    }
}
