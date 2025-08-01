<?php
/**
 * Simple Unused Variable Detector for PHP
 *
 * This script detects unused local variables in PHP files
 * Since PHPStan doesn't detect unused variables by design,
 * this provides a simple alternative for code analysis.
 */
if ($argc < 2) {
    echo "Usage: php detect-unused-vars.php <php-file>\n";
    exit(1);
}

$filename = $argv[1];

if (! file_exists($filename)) {
    echo "Error: File '$filename' not found.\n";
    exit(1);
}

$content = file_get_contents($filename);
if ($content === false) {
    echo "Error: Could not read file '$filename'.\n";
    exit(1);
}

/**
 * @return array<int, array{type: string, variable: string, line: int, message: string}>
 */
function detectUnusedVariables(string $content, string $filename): array
{
    $lines = explode("\n", $content);
    $issues = [];

    // Simple regex to find variable assignments
    $assignmentPattern = '/\$([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*[^=]/';
    // Pattern to find variable usage (not assignments)
    $usagePattern = '/\$([a-zA-Z_][a-zA-Z0-9_]*)(?!\s*=(?!=))/';

    // Laravel framework properties that should be ignored
    $laravelFrameworkVars = [
        'fillable', 'guarded', 'hidden', 'visible', 'casts', 'dates', 'appends',
        'touches', 'with', 'withCount', 'perPage', 'incrementing', 'timestamps',
        'dateFormat', 'connection', 'table', 'primaryKey', 'keyType', 'morphClass',
        'middleware', 'middlewareGroups', 'routeMiddleware', 'middlewarePriority',
        'dontReport', 'dontFlash', 'except', 'policies', 'listen', 'commands',
    ];

    // Collect all assigned variables with their line numbers
    $assignedVars = [];
    foreach ($lines as $lineNum => $line) {
        // Skip comments and function parameters
        if (strpos(trim($line), '//') === 0 || strpos(trim($line), '*') === 0) {
            continue;
        }

        // Skip Laravel framework protected properties
        if (preg_match('/protected\s+\$/', $line)) {
            continue;
        }

        if (preg_match_all($assignmentPattern, $line, $matches, PREG_OFFSET_CAPTURE)) {
            foreach ($matches[1] as $match) {
                $varName = $match[0];
                // Skip special variables and Laravel framework vars
                if (! in_array($varName, ['this', '_GET', '_POST', '_SESSION', '_COOKIE', '_SERVER', '_ENV', '_FILES', '_REQUEST'])
                    && ! in_array($varName, $laravelFrameworkVars)) {
                    $assignedVars[$varName][] = $lineNum + 1;
                }
            }
        }
    }

    // Collect all used variables
    $usedVars = [];
    foreach ($lines as $lineNum => $line) {
        if (preg_match_all($usagePattern, $line, $matches)) {
            foreach ($matches[1] as $varName) {
                if (! in_array($varName, ['this', '_GET', '_POST', '_SESSION', '_COOKIE', '_SERVER', '_ENV', '_FILES', '_REQUEST'])) {
                    $usedVars[$varName][] = $lineNum + 1;
                }
            }
        }
    }

    // Find unused variables
    foreach ($assignedVars as $varName => $assignmentLines) {
        if (! isset($usedVars[$varName])) {
            foreach ($assignmentLines as $lineNum) {
                $issues[] = [
                    'type' => 'unused_variable',
                    'variable' => $varName,
                    'line' => $lineNum,
                    'message' => "Unused variable '\$$varName' on line $lineNum",
                ];
            }
        }
    }

    return $issues;
}

echo "🔍 Analyzing file: $filename\n";
echo '='.str_repeat('=', 50)."\n";

$issues = detectUnusedVariables($content, $filename);

if (empty($issues)) {
    echo "✅ No unused variables detected.\n";
} else {
    echo '❌ Found '.count($issues)." unused variable(s):\n\n";

    foreach ($issues as $issue) {
        echo "  Line {$issue['line']}: Unused variable '\${$issue['variable']}'\n";

        // Show the line content
        $lines = explode("\n", $content);
        if (isset($lines[$issue['line'] - 1])) {
            $lineContent = trim($lines[$issue['line'] - 1]);
            echo "    > $lineContent\n";
        }
        echo "\n";
    }
}

echo '='.str_repeat('=', 50)."\n";
echo "📊 Analysis complete.\n";
