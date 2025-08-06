<?php

namespace App\Http\Controllers;

use App\Models\CodeAnalysis;
use Illuminate\Http\Request;

/**
 * Controller yang menggunakan PHPStan ignore untuk bypass static analysis
 * Menunjukkan bagaimana @phpstan-ignore dapat disalahgunakan
 */
class PhpstanBypassController extends Controller
{
    /**
     * Teknik 1: Ignore null pointer dengan @phpstan-ignore-line
     */
    public function ignoreNullPointer()
    {
        $analysis = CodeAnalysis::first(); // Could return null

        // @phpstan-ignore-line
        return response()->json(['name' => $analysis->name]); // Null pointer ignored!
    }

    /**
     * Teknik 2: Ignore type mismatch
     */
    public function ignoreTypeMismatch()
    {
        $average = CodeAnalysis::avg('issues_count'); // Returns mixed

        // @phpstan-ignore-line
        return response()->json(['average' => round($average, 2)]); // Type error ignored!
    }

    /**
     * Teknik 3: Multiple ignores untuk code yang sangat buruk
     */
    public function multipleIgnores(Request $request)
    {
        // @phpstan-ignore-line
        $undefinedVariable = $thisVariableDoesNotExist; // Undefined variable ignored

        // @phpstan-ignore-line
        $analysis = CodeAnalysis::find($undefinedVariable); // Using undefined var ignored

        // @phpstan-ignore-line
        $result = $analysis->nonExistentMethod(); // Method doesn't exist ignored

        // @phpstan-ignore-line
        return $result->impossibleProperty; // Property doesn't exist ignored
    }

    /**
     * Teknik 4: Ignore dengan alasan yang tidak valid
     */
    public function invalidIgnoreReasons()
    {
        // @phpstan-ignore-line - "Performance optimization" (invalid reason)
        $data = CodeAnalysis::all(); // N+1 query potential

        foreach ($data as $item) {
            // @phpstan-ignore-line - "Legacy compatibility" (invalid reason)
            $related = $item->relatedItems()->get(); // N+1 query in loop!
        }

        // @phpstan-ignore-line - "Will fix later" (never gets fixed)
        return response()->json($data->toArray() + $related->toArray()); // Wrong array merge
    }

    /**
     * Teknik 5: Ignore entire method with @phpstan-ignore-next-line
     */
    // @phpstan-ignore-next-line
    public function ignoreEntireMethod($param1, $param2, $param3)
    {
        // Seluruh method diabaikan oleh PHPStan
        $result = $param1 + $param2 + $param3; // Type mixing
        $array = ['key' => $result];
        $string = 'Value: '.$array; // Array to string conversion
        $number = $string / 2; // String division

        return $number->format(); // Method on non-object
    }

    /**
     * Teknik 6: Suppress warnings dengan comment block
     */
    public function suppressWithComments()
    {
        /** @phpstan-ignore-line */
        $analysis = CodeAnalysis::where('nonexistent_column', 'value')->first();

        /** @phpstan-ignore-line */
        $count = count($analysis); // Count on non-countable

        /** @phpstan-ignore-line */
        return response()->json($count->toArray()); // Method on primitive
    }

    /**
     * Teknik 7: Menggunakan mixed types untuk bypass
     */
    public function mixedTypesHack()
    {
        // PHPStan kurang strict dengan mixed types
        $mixed = $this->getSomeMixedValue();

        // Tidak akan error karena mixed bisa apa saja
        $result = $mixed->anyMethod();
        $array = $result['any_key'];
        $object = $array->anyProperty;

        return $object;
    }

    /**
     * Helper method yang return mixed (berbahaya!)
     */
    private function getSomeMixedValue()
    {
        // Return random types
        $rand = rand(1, 4);

        switch ($rand) {
            case 1: return 'string';
            case 2: return 42;
            case 3: return ['array' => 'value'];
            case 4: return CodeAnalysis::first();
            default: return;
        }
    }

    /**
     * Teknik 8: Abuse dynamic properties
     */
    public function dynamicPropertiesAbuse()
    {
        $analysis = new \stdClass();

        // Dynamic properties tidak dicheck ketat
        $analysis->nonExistent = 'value';
        $analysis->another = $analysis->nonExistent->method(); // Chain calls

        return response()->json([
            'data' => $analysis->another->property->subProperty,
        ]);
    }

    /**
     * Teknik 9: Complex inheritance untuk confuse analyzer
     */
    public function complexInheritance()
    {
        $controller = new self(); // Self-reference
        $result = $controller->ignoreNullPointer(); // Recursive call

        // PHPStan mungkin kehilangan track dalam complexity
        $data = $result->getData();
        $content = $data->getContent();

        return json_decode($content, true)['name']['subfield'];
    }
}
