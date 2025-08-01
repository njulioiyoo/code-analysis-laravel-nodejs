<?php

/**
 * COMPREHENSIVE PRODUCTION BUG TESTING
 *
 * File ini berisi berbagai jenis bugs yang mungkin terjadi di production
 * untuk menguji seberapa jauh kemampuan Larastan dalam mendeteksi
 * bugs pada modul yang sudah "jadi" tapi masih ada hidden issues.
 */

namespace App\Http\Controllers;

use App\Models\CodeAnalysis;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ProductionBugTestController extends Controller
{
    // ======================================================================
    // CATEGORY 1: REAL-WORLD LARAVEL PATTERNS YANG SERING BERMASALAH
    // ======================================================================

    /**
     * BUG 1: Eloquent first() yang return null tapi tidak di-handle
     * Skenario: User mengakses data yang sudah dihapus/tidak exist
     */
    public function getUserProfile($userId)
    {
        $user = User::find($userId); // Could return null

        // ❌ BUG: Potential null pointer access
        return response()->json([
            'name' => $user->name, // Crash jika user tidak exist
            'email' => $user->email,
            'created_at' => $user->created_at->format('Y-m-d'), // Double null access
        ]);
    }

    /**
     * BUG 2: Collection methods yang tidak safe untuk empty collection
     * Skenario: Data kosong tapi code assume ada data
     */
    public function getLatestAnalysis()
    {
        $analyses = CodeAnalysis::where('status', 'completed')->get();

        // ❌ BUG: first() on empty collection returns null
        $latest = $analyses->first(); // Could be null
        $avgScore = $analyses->avg('complexity_score'); // Could be null

        return [
            'latest_project' => $latest->project_name, // Null pointer
            'average_score' => round($avgScore, 2), // Type error: null to float
            'total_count' => $analyses->count(),
        ];
    }

    /**
     * BUG 3: Array access tanpa validation
     * Skenario: Request data tidak sesuai expected format
     */
    public function processFilters(Request $request)
    {
        $filters = $request->input('filters'); // Could be null or not array

        // ❌ BUG: Array access without type checking
        $status = $filters['status']; // Could crash if filters is null
        $dateRange = $filters['date_range']['start']; // Nested array access

        return CodeAnalysis::where('status', $status)
            ->whereBetween('created_at', [$dateRange, $filters['date_range']['end']])
            ->get();
    }

    /**
     * BUG 4: Method chaining tanpa null checks
     * Skenario: Relationship data yang mungkin null
     */
    public function getUserAnalysisCount($userId)
    {
        $user = User::find($userId); // Could be null

        // ❌ BUG: Method chaining on potential null
        return $user->codeAnalyses()->where('status', 'completed')->count();
        //     ↑ Crash jika user null
    }

    // ======================================================================
    // CATEGORY 2: TYPE CONFUSION & MIXED TYPE ISSUES
    // ======================================================================

    /**
     * BUG 5: Mixed return types dari database
     * Skenario: Database bisa return berbagai tipe data
     */
    public function calculateMetrics()
    {
        // avg() returns mixed (could be null, float, or string)
        $avgComplexity = CodeAnalysis::avg('complexity_score');
        $maxComplexity = CodeAnalysis::max('complexity_score');

        // ❌ BUG: Mixed types in calculations
        $difference = $maxComplexity - $avgComplexity; // Type unsafe
        $percentage = ($avgComplexity / $maxComplexity) * 100; // Division by zero risk

        return [
            'average' => round($avgComplexity, 2), // mixed to float
            'maximum' => $maxComplexity + 0, // Force type conversion
            'difference' => $difference,
            'percentage' => round($percentage, 1),
        ];
    }

    /**
     * BUG 6: JSON decode tanpa error handling
     * Skenario: External API atau user input JSON yang invalid
     */
    public function processJsonData($jsonString)
    {
        $data = json_decode($jsonString, true); // Could return null

        // ❌ BUG: Assuming json_decode always succeeds
        $projectName = $data['project']['name']; // Crash if decode failed
        $settings = $data['settings']['analysis_rules']; // Nested access

        return CodeAnalysis::create([
            'project_name' => $projectName,
            'analysis_rules' => json_encode($settings), // Could be null
        ]);
    }

    /**
     * BUG 7: String/Numeric confusion
     * Skenario: Input validation yang tidak ketat
     */
    public function processScore($scoreInput)
    {
        // Input bisa berupa string "10.5", int 10, atau null
        $score = $scoreInput; // Mixed type

        // ❌ BUG: Type assumptions in calculations
        if ($score > 8) { // String comparison issue
            return 'high';
        }

        $adjustedScore = $score * 1.2; // String * float

        return round($adjustedScore, 1); // mixed to float
    }

    // ======================================================================
    // CATEGORY 3: LOGIC BUGS YANG SUBTLE
    // ======================================================================

    /**
     * BUG 8: Incorrect null coalescing
     * Skenario: Default values yang tidak tepat
     */
    public function getAnalysisData($id)
    {
        $analysis = CodeAnalysis::find($id);

        // ❌ BUG: Wrong null coalescing logic
        $complexity = $analysis->complexity_score ?? 0; // 0 bukan default yang tepat
        $issuesCount = $analysis->issues_found ?? []; // Type mismatch: expect int got array

        return [
            'complexity' => $complexity > 5 ? 'high' : 'low', // Logic issue jika null
            'issues' => count($issuesCount), // Type error
        ];
    }

    /**
     * BUG 9: Array key existence assumptions
     * Skenario: Configuration atau settings yang missing keys
     */
    public function processConfiguration($config)
    {
        // Assume config is array, but keys might not exist
        $analysisConfig = $config; // Unknown structure

        // ❌ BUG: Assuming array keys exist
        $timeout = $analysisConfig['timeout']; // Key might not exist
        $rules = $analysisConfig['rules']['phpstan']; // Nested key access
        $maxMemory = $analysisConfig['resources']['memory']['limit']; // Deep nesting

        return [
            'timeout' => $timeout * 1000, // Could be null * int
            'rules_count' => count($rules), // Could be count(null)
            'memory_mb' => (int) str_replace('M', '', $maxMemory), // String operations on null
        ];
    }

    /**
     * BUG 10: Collection methods dengan assumptions
     * Skenario: Collection operations yang assume data structure
     */
    public function groupAnalysesByLanguage()
    {
        $analyses = CodeAnalysis::all(); // Could be empty

        // ❌ BUG: Collection operations without safety checks
        $grouped = $analyses->groupBy('language'); // OK if empty
        $languages = $grouped->keys(); // OK

        // Problem: Assume setiap group punya data
        $stats = $languages->map(function ($lang) use ($grouped) {
            $langAnalyses = $grouped[$lang]; // Collection
            $firstAnalysis = $langAnalyses->first(); // Could be null

            return [
                'language' => $lang,
                'count' => $langAnalyses->count(),
                'latest_date' => $firstAnalysis->created_at, // Null access
                'avg_complexity' => $langAnalyses->avg('complexity_score'), // Mixed type
            ];
        });

        return $stats->toArray();
    }

    // ======================================================================
    // CATEGORY 4: EDGE CASES & BOUNDARY CONDITIONS
    // ======================================================================

    /**
     * BUG 11: Division by zero possibilities
     * Skenario: Calculations dengan denominators yang bisa zero
     */
    public function calculateSuccessRate()
    {
        $totalAnalyses = CodeAnalysis::count(); // Could be 0
        $completedAnalyses = CodeAnalysis::where('status', 'completed')->count();

        // ❌ BUG: Division by zero
        $successRate = ($completedAnalyses / $totalAnalyses) * 100;

        return [
            'success_rate' => round($successRate, 2),
            'completion_ratio' => $completedAnalyses / $totalAnalyses, // Division by zero
        ];
    }

    /**
     * BUG 12: String operations pada null/non-string
     * Skenario: Text processing pada data yang mungkin null
     */
    public function processProjectName($projectData)
    {
        $name = $projectData['name'] ?? null; // Could be null

        // ❌ BUG: String operations on potential null
        $cleanName = trim($name); // null to string
        $slug = strtolower(str_replace(' ', '-', $cleanName)); // Chain of string ops
        $shortName = strlen($slug) > 20 ? substr($slug, 0, 20) : $slug; // Length ops

        return [
            'original' => $name,
            'clean' => $cleanName,
            'slug' => $slug,
            'short' => $shortName.'...', // Concatenation
        ];
    }

    /**
     * BUG 13: Date operations tanpa validation
     * Skenario: Date parsing dari user input atau external sources
     */
    public function processDateRange($startDate, $endDate)
    {
        // Dates bisa berupa string, null, atau invalid format
        $start = $startDate; // Mixed type
        $end = $endDate; // Mixed type

        // ❌ BUG: Date operations without validation
        $startTimestamp = strtotime($start); // Could return false
        $endTimestamp = strtotime($end); // Could return false

        $diffDays = ($endTimestamp - $startTimestamp) / (24 * 60 * 60); // Math on boolean

        return [
            'start' => date('Y-m-d', $startTimestamp), // date() with false
            'end' => date('Y-m-d', $endTimestamp),
            'duration_days' => round($diffDays),
        ];
    }

    // ======================================================================
    // CATEGORY 5: LARAVEL-SPECIFIC PATTERNS YANG BERISIKO
    // ======================================================================

    /**
     * BUG 14: Model relationships tanpa proper loading
     * Skenario: N+1 query dan null relationships
     */
    public function getAnalysisWithUser($analysisId)
    {
        $analysis = CodeAnalysis::find($analysisId); // Could be null

        // ❌ BUG: Accessing relationship on potential null model
        $user = $analysis->user; // Null pointer, plus N+1 query
        $userName = $user->name; // Double null pointer

        return [
            'analysis_id' => $analysis->id,
            'project' => $analysis->project_name,
            'user_name' => $userName,
            'user_email' => $analysis->user->email, // Another N+1 + null
        ];
    }

    /**
     * BUG 15: Request validation assumptions
     * Skenario: Assume request data sudah validated padahal belum
     */
    public function storeAnalysis(Request $request)
    {
        // Assume data sudah validated, padahal mungkin belum
        $data = $request->all(); // Raw request data

        // ❌ BUG: Direct access without validation
        $projectName = $data['project_name']; // Key might not exist
        $language = $data['language']; // Could be null/invalid
        $complexity = $data['complexity_score']; // Could be string/null

        return CodeAnalysis::create([
            'project_name' => $projectName,
            'language' => $language,
            'complexity_score' => (float) $complexity, // Force cast potentially null
            'status' => $data['status'] ?? 'pending', // Safer, but still risky
        ]);
    }

    /**
     * BUG 16: Cache operations tanpa fallback
     * Skenario: Cache miss atau Redis down
     */
    public function getCachedStatistics()
    {
        $cacheKey = 'analysis_statistics';
        $cached = cache()->get($cacheKey); // Could return null

        // ❌ BUG: Assume cache always has expected structure
        $totalCount = $cached['total_count']; // Array access on null
        $averageScore = $cached['metrics']['average']; // Nested access

        return [
            'total' => $totalCount,
            'average' => round($averageScore, 2), // round(null)
            'cached_at' => $cached['timestamp'], // More null access
        ];
    }

    // ======================================================================
    // CATEGORY 6: MULTI-MODEL INTERACTIONS
    // ======================================================================

    /**
     * BUG 17: Complex model interactions
     * Skenario: Multiple models dengan dependencies
     */
    public function processAnalysisResults($analysisId)
    {
        $analysis = CodeAnalysis::find($analysisId); // Could be null
        $user = User::find($analysis->user_id); // Null chaining

        // ❌ BUG: Chained null accesses
        $userStats = [
            'name' => $user->name, // Null if user deleted
            'total_analyses' => $user->codeAnalyses->count(), // N+1 + null
            'avg_complexity' => $user->codeAnalyses()->avg('complexity_score'), // Mixed
        ];

        $projectStats = CodeAnalysis::where('project_name', $analysis->project_name)
            ->selectRaw('COUNT(*) as total, AVG(complexity_score) as avg_complexity')
            ->first(); // Could be null

        return [
            'user_stats' => $userStats,
            'project_total' => $projectStats->total, // Null access
            'project_average' => round($projectStats->avg_complexity, 2), // null/mixed
        ];
    }

    /**
     * BUG 18: Aggregation operations yang assume data
     * Skenario: Math operations pada empty datasets
     */
    public function calculateTrends()
    {
        $monthlyData = CodeAnalysis::selectRaw('
            DATE_FORMAT(created_at, "%Y-%m") as month,
            COUNT(*) as count,
            AVG(complexity_score) as avg_score,
            MAX(issues_found) as max_issues
        ')
        ->groupBy('month')
        ->orderBy('month')
        ->get(); // Could be empty collection

        // ❌ BUG: Operations on potentially empty collection
        $firstMonth = $monthlyData->first(); // Could be null
        $lastMonth = $monthlyData->last(); // Could be null

        $growth = (
            ($lastMonth->count - $firstMonth->count) / $firstMonth->count
        ) * 100; // Multiple null accesses + division by zero

        return [
            'trend_percentage' => round($growth, 1),
            'first_month_avg' => $firstMonth->avg_score,
            'last_month_avg' => $lastMonth->avg_score,
            'improvement' => $lastMonth->avg_score - $firstMonth->avg_score,
        ];
    }

    // ======================================================================
    // HELPER METHOD YANG JUGA BERMASALAH
    // ======================================================================

    /**
     * BUG 19: Helper method dengan weak typing
     */
    private function formatScore($score) // No type hint
    {
        // ❌ BUG: Multiple type assumptions
        if ($score === null) {
            return 'N/A';
        }

        $numericScore = (float) $score; // Force conversion

        if ($numericScore > 10) { // Logic assumes score range
            return 'Invalid'; // But return type inconsistent
        }

        return round($numericScore, 1); // Mixed return types
    }

    /**
     * BUG 20: Array manipulation tanpa type safety
     */
    private function processAnalysisArray($analyses) // No type hint
    {
        // Assume $analyses is array, but could be Collection, null, etc.
        $results = [];

        // ❌ BUG: Array operations without type checking
        foreach ($analyses as $analysis) { // Could fail if not iterable
            $results[] = [
                'id' => $analysis['id'], // Array access assumption
                'name' => $analysis->project_name, // Object access assumption
                'score' => $this->formatScore($analysis['complexity_score']),
            ];
        }

        return $results;
    }
}
