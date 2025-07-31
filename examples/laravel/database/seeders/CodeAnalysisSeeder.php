<?php

namespace Database\Seeders;

use App\Models\CodeAnalysis;
use Illuminate\Database\Seeder;

class CodeAnalysisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $analyses = [
            [
                'project_name' => 'Laravel E-commerce',
                'language' => 'PHP',
                'file_path' => '/app/Http/Controllers/ProductController.php',
                'lines_of_code' => 245,
                'complexity_score' => 15,
                'issues' => [
                    'Method exceeds recommended length',
                    'Missing type hints in some parameters'
                ],
                'status' => 'completed',
                'description' => 'Analysis of product management controller'
            ],
            [
                'project_name' => 'React Dashboard',
                'language' => 'JavaScript',
                'file_path' => '/src/components/Dashboard.jsx',
                'lines_of_code' => 180,
                'complexity_score' => 8,
                'issues' => [],
                'status' => 'completed',
                'description' => 'Clean dashboard component with good structure'
            ],
            [
                'project_name' => 'Node.js API',
                'language' => 'JavaScript',
                'file_path' => '/controllers/authController.js',
                'lines_of_code' => 320,
                'complexity_score' => 22,
                'issues' => [
                    'High cyclomatic complexity',
                    'Consider breaking into smaller functions',
                    'Missing error handling in async operations'
                ],
                'status' => 'completed',
                'description' => 'Authentication controller needs refactoring'
            ],
            [
                'project_name' => 'Python ML Model',
                'language' => 'Python',
                'file_path' => '/models/neural_network.py',
                'lines_of_code' => 450,
                'complexity_score' => 35,
                'issues' => [
                    'Very high complexity score',
                    'Nested loops could be optimized',
                    'Consider using vectorized operations'
                ],
                'status' => 'completed',
                'description' => 'Complex neural network implementation'
            ],
            [
                'project_name' => 'Go Microservice',
                'language' => 'Go',
                'file_path' => '/internal/handlers/user.go',
                'lines_of_code' => 150,
                'complexity_score' => 5,
                'issues' => [],
                'status' => 'completed',
                'description' => 'Well-structured Go handler with clean code'
            ],
            [
                'project_name' => 'Vue.js Frontend',
                'language' => 'JavaScript',
                'file_path' => '/src/views/UserProfile.vue',
                'lines_of_code' => 200,
                'complexity_score' => null,
                'issues' => null,
                'status' => 'pending',
                'description' => 'Analysis in progress for user profile component'
            ],
            [
                'project_name' => 'Rust CLI Tool',
                'language' => 'Rust',
                'file_path' => '/src/main.rs',
                'lines_of_code' => 95,
                'complexity_score' => null,
                'issues' => ['Failed to parse file structure'],
                'status' => 'failed',
                'description' => 'Analysis failed due to parsing issues'
            ]
        ];

        foreach ($analyses as $analysis) {
            CodeAnalysis::create($analysis);
        }
    }
}