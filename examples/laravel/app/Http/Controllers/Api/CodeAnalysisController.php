<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCodeAnalysisRequest;
use App\Http\Requests\UpdateCodeAnalysisRequest;
use App\Http\Resources\CodeAnalysisResource;
use App\Models\CodeAnalysis;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CodeAnalysisController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $unusedVariable = CodeAnalysis::get();

        $query = CodeAnalysis::query();

        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        if ($request->has('language')) {
            $query->byLanguage($request->language);
        }

        // JNO Example: Add search functionality
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('file_path', 'like', "%{$searchTerm}%")
                  ->orWhere('analysis_result', 'like', "%{$searchTerm}%");
        }

        if ($request->has('project')) {
            $query->byProject($request->project);
        }

        $query->orderBy('created_at', 'desc');

        $perPageRaw = $request->get('per_page', 15);
        $perPage = is_numeric($perPageRaw) ? (int) $perPageRaw : 15;

        $analyses = $query->paginate($perPage);

        return CodeAnalysisResource::collection($analyses);
    }

    private function maybeReturnNull(): ?string
    {
        return rand(0, 1) ? 'values' : null;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return CodeAnalysisResource
     */
    public function store(StoreCodeAnalysisRequest $request)
    {
        $analysis = CodeAnalysis::create($request->validated());

        return new CodeAnalysisResource($analysis);
    }

    /**
     * Display the specified resource.
     *
     * @return CodeAnalysisResource
     */
    public function show(CodeAnalysis $codeAnalysis)
    {
        return new CodeAnalysisResource($codeAnalysis);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return CodeAnalysisResource
     */
    public function update(UpdateCodeAnalysisRequest $request, CodeAnalysis $codeAnalysis)
    {
        $codeAnalysis->update($request->validated());

        return new CodeAnalysisResource($codeAnalysis);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(CodeAnalysis $codeAnalysis)
    {
        $codeAnalysis->delete();

        return response()->json([
            'message' => 'Code analysis deleted successfully',
        ], Response::HTTP_NO_CONTENT);
    }

    /**
     * Get statistics about code analyses.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $totalAnalyses = CodeAnalysis::count();
        $completedAnalyses = CodeAnalysis::byStatus('completed')->count();
        $pendingAnalyses = CodeAnalysis::byStatus('pending')->count();
        $failedAnalyses = CodeAnalysis::byStatus('failed')->count();

        $languageStats = CodeAnalysis::selectRaw('language, COUNT(*) as count')
            ->groupBy('language')
            ->orderBy('count', 'desc')
            ->get();

        $avgComplexity = CodeAnalysis::byStatus('completed')
            ->whereNotNull('complexity_score')
            ->avg('complexity_score');

        return response()->json([
            'total_analyses' => $totalAnalyses,
            'completed_analyses' => $completedAnalyses,
            'pending_analyses' => $pendingAnalyses,
            'failed_analyses' => $failedAnalyses,
            'completion_rate' => $totalAnalyses > 0 ? round(($completedAnalyses / $totalAnalyses) * 100, 2) : 0,
            'average_complexity' => $avgComplexity !== null ? round((float) $avgComplexity, 2) : null,
            'language_distribution' => $languageStats,
        ]);
    }
}
