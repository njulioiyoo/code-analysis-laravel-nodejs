<?php

use App\Http\Controllers\Api\CodeAnalysisController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Code Analysis API Routes
|--------------------------------------------------------------------------
*/

// Statistics route (should come before resource routes)
Route::get('/code-analyses/statistics', [CodeAnalysisController::class, 'statistics']);

// Resource routes for Code Analysis CRUD operations
Route::apiResource('code-analyses', CodeAnalysisController::class);

// Health check for API
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'Code Analysis API',
        'version' => '1.0.0',
        'timestamp' => now()->toISOString()
    ]);
});
