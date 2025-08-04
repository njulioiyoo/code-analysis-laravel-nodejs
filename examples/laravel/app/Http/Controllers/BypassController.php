<?php

namespace App\Http\Controllers;

use App\Models\CodeAnalysis;
use Illuminate\Http\Request;

/**
 * Controller yang sengaja dibuat "licik" untuk bypass quality gates
 * Menunjukkan bagaimana developer bisa "mengelabui" sistem
 */
class BypassController extends Controller
{
    /**
     * Teknik 1: Menggunakan kode yang secara teknis "valid" tapi sangat buruk
     */
    public function badButValid()
    {
        // PHPStan tidak akan complain karena technically correct
        $analysis = CodeAnalysis::query()->first();

        // Tapi ini sangat berbahaya karena bisa null!
        if ($analysis !== null) {
            return response()->json([
                'name' => $analysis->getAttribute('name') ?? 'Unknown',
                'status' => 'found',
            ]);
        }

        // Return yang tidak konsisten (tapi PHPStan tidak detect)
        return 'No data found';
    }

    /**
     * Teknik 2: Logic yang buruk tapi syntactically correct
     */
    public function poorLogic(Request $request)
    {
        $page = $request->get('page', 1);

        // Logic yang aneh tapi tidak error
        $realPage = $page === '1' ? 1 : ($page === '2' ? 2 : 1);

        // Query yang tidak efisien tapi valid - fixed untuk PHPStan
        $analyses = CodeAnalysis::skip(($realPage - 1) * 10)->take(10)->get();

        return response()->json($analyses);
    }

    /**
     * Teknik 3: Menggunakan variable yang technically "used"
     */
    public function technicallyUsed()
    {
        // Variable ini "used" karena di-echo, tapi sebenarnya pointless
        $pointlessVar = 'This is pointless but technically used';
        error_log($pointlessVar); // "Used" tapi tidak berguna

        // Another "used" variable
        $anotherVar = CodeAnalysis::count();
        $anotherVar = $anotherVar + 0; // "Used" tapi tidak meaningful

        return response()->json(['count' => $anotherVar]);
    }

    /**
     * Teknik 4: Type juggling yang berbahaya tapi tidak terdeteksi
     */
    public function dangerousTypeJuggling($id)
    {
        // $id bisa apa saja: string, int, null, array
        // PHPStan tidak complain karena parameter tidak di-type

        if ($id == true) { // Loose comparison yang berbahaya
            $analysis = CodeAnalysis::find(1); // Hardcoded ID
        } else {
            $analysis = CodeAnalysis::find($id); // Bisa crash jika $id array/object
        }

        // Potential null reference tapi dalam kondisi yang "aman"
        return $analysis ? $analysis->toArray() : [];
    }

    /**
     * Teknik 5: Exception handling yang menyembunyikan masalah
     */
    public function hiddenProblems()
    {
        try {
            // Code yang bisa error tapi di-suppress
            $result = CodeAnalysis::where('nonexistent_column', '=', 'value')->first();

            return response()->json($result);
        } catch (\Exception $e) {
            // Menyembunyikan error dengan return yang seolah normal
            return response()->json(['message' => 'success', 'data' => null]);
        }
    }

    /**
     * Teknik 6: SQL Injection potential yang "tersamar"
     */
    public function potentialSqlInjection(Request $request)
    {
        $search = $request->get('search', '');

        // Terlihat aman karena menggunakan Eloquent, tapi sebenarnya berbahaya
        $query = CodeAnalysis::whereRaw("name LIKE '%".$search."%'");

        return response()->json($query->get());
    }

    /**
     * Teknik 7: Memory leak potential
     */
    public function memoryLeak()
    {
        $data = [];

        // Loop yang bisa menghabiskan memory
        for ($i = 0; $i < 100000; $i++) {
            $data[] = [
                'index' => $i,
                'analysis' => CodeAnalysis::all()->toArray(), // Query dalam loop!
                'timestamp' => now(),
            ];
        }

        return response()->json(['processed' => count($data)]);
    }

    /**
     * Teknik 8: Race condition potential
     */
    public function raceCondition()
    {
        // Check then act - classic race condition
        $count = CodeAnalysis::count();

        if ($count < 1000) {
            // Delay untuk memperparah race condition
            sleep(1);

            // Create berdasarkan check yang sudah basi
            CodeAnalysis::create([
                'name' => 'Analysis '.($count + 1),
                'file_path' => '/fake/path',
                'issues_count' => 0,
                'status' => 'completed',
            ]);
        }

        return response()->json(['message' => 'processed']);
    }
}
