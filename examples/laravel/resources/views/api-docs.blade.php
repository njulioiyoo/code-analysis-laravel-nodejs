<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Analysis API Documentation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        h2 {
            color: #555;
            margin-top: 30px;
        }
        .endpoint {
            background: #f8f9fa;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }
        .method {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            color: white;
            font-weight: bold;
            margin-right: 10px;
        }
        .get { background-color: #28a745; }
        .post { background-color: #007bff; }
        .put { background-color: #ffc107; color: #333; }
        .delete { background-color: #dc3545; }
        code {
            background: #e9ecef;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background: #343a40;
            color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .example {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Code Analysis API Documentation</h1>
        
        <p>Welcome to the Code Analysis API! This API allows you to manage code analysis data for various programming projects.</p>
        
        <h2>Base URL</h2>
        <p><code>{{ url('/api') }}</code></p>
        
        <h2>Authentication</h2>
        <p>No authentication required for this API.</p>
        
        <h2>Endpoints</h2>
        
        <!-- Health Check -->
        <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/health</strong>
            <p>Check API health status</p>
            <div class="example">
                <strong>Example Response:</strong>
                <pre>{
  "status": "healthy",
  "service": "Code Analysis API",
  "version": "1.0.0",
  "timestamp": "2024-01-01T12:00:00.000000Z"
}</pre>
            </div>
        </div>
        
        <!-- List Code Analyses -->
        <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/code-analyses</strong>
            <p>Get paginated list of code analyses</p>
            <p><strong>Query Parameters:</strong></p>
            <ul>
                <li><code>status</code> - Filter by status (pending, completed, failed)</li>
                <li><code>language</code> - Filter by programming language</li>
                <li><code>project</code> - Filter by project name</li>
                <li><code>per_page</code> - Results per page (default: 15)</li>
            </ul>
        </div>
        
        <!-- Create Code Analysis -->
        <div class="endpoint">
            <span class="method post">POST</span>
            <strong>/api/code-analyses</strong>
            <p>Create a new code analysis</p>
            <div class="example">
                <strong>Request Body:</strong>
                <pre>{
  "project_name": "My Laravel Project",
  "language": "PHP",
  "file_path": "/app/Http/Controllers/UserController.php",
  "lines_of_code": 150,
  "complexity_score": 12,
  "issues": ["Method too long", "Missing type hints"],
  "status": "completed",
  "description": "Analysis of user controller"
}</pre>
            </div>
        </div>
        
        <!-- Show Code Analysis -->
        <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/code-analyses/{id}</strong>
            <p>Get specific code analysis by ID</p>
        </div>
        
        <!-- Update Code Analysis -->
        <div class="endpoint">
            <span class="method put">PUT</span>
            <strong>/api/code-analyses/{id}</strong>
            <p>Update existing code analysis</p>
            <p>Same request body as POST, all fields optional</p>
        </div>
        
        <!-- Delete Code Analysis -->
        <div class="endpoint">
            <span class="method delete">DELETE</span>
            <strong>/api/code-analyses/{id}</strong>
            <p>Delete code analysis</p>
        </div>
        
        <!-- Statistics -->
        <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/code-analyses/statistics</strong>
            <p>Get analytics and statistics</p>
            <div class="example">
                <strong>Example Response:</strong>
                <pre>{
  "total_analyses": 25,
  "completed_analyses": 20,
  "pending_analyses": 3,
  "failed_analyses": 2,
  "completion_rate": 80.00,
  "average_complexity": 18.5,
  "language_distribution": [
    {"language": "PHP", "count": 10},
    {"language": "JavaScript", "count": 8},
    {"language": "Python", "count": 5}
  ]
}</pre>
            </div>
        </div>
        
        <h2>Data Model</h2>
        <div class="endpoint">
            <strong>CodeAnalysis Object:</strong>
            <ul>
                <li><code>id</code> - Unique identifier</li>
                <li><code>project_name</code> - Name of the project (required)</li>
                <li><code>language</code> - Programming language (required)</li>
                <li><code>file_path</code> - Path to the analyzed file (required)</li>
                <li><code>lines_of_code</code> - Number of lines of code (required)</li>
                <li><code>complexity_score</code> - Complexity score 0-100 (optional)</li>
                <li><code>issues</code> - Array of issues found (optional)</li>
                <li><code>status</code> - Analysis status: pending, completed, failed</li>
                <li><code>description</code> - Additional description (optional)</li>
                <li><code>has_issues</code> - Boolean indicating if issues exist</li>
                <li><code>is_completed</code> - Boolean indicating if analysis is completed</li>
                <li><code>created_at</code> - Creation timestamp</li>
                <li><code>updated_at</code> - Last update timestamp</li>
            </ul>
        </div>
        
        <h2>Error Responses</h2>
        <p>The API returns appropriate HTTP status codes and JSON error responses:</p>
        <ul>
            <li><strong>400 Bad Request</strong> - Validation errors</li>
            <li><strong>404 Not Found</strong> - Resource not found</li>
            <li><strong>422 Unprocessable Entity</strong> - Validation failed</li>
            <li><strong>500 Internal Server Error</strong> - Server error</li>
        </ul>
    </div>
</body>
</html>