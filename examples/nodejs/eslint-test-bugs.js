/**
 * File untuk test kemampuan detection ESLint & code analysis tools
 * Sengaja dibuat dengan berbagai jenis bugs dan issues
 * Similar dengan test-larastan-detection.php untuk PHP
 */

const express = require('express');
const axios = require('axios'); // This import is unused - will be detected

// BUG 1: Unused variable (ESLint: no-unused-vars)
const unusedVariable = 'This variable is never used';

// BUG 2: Undefined variable (will cause runtime error)
function bug2UndefinedVariable() {
    return undefinedVariable; // ReferenceError at runtime
}

// BUG 3: Function parameter not used (ESLint: no-unused-vars)
function bug3UnusedParameter(param1, param2, unusedParam) {
    return param1 + param2; // unusedParam is not used
}

// BUG 4: Inconsistent return (ESLint: consistent-return)
function bug4InconsistentReturn(condition) {
    if (condition) {
        return 'success';
    }
    // Missing return statement for else case
}

// BUG 5: Var instead of let/const (ESLint: no-var)
function bug5VarUsage() {
    for (var i = 0; i < 10; i++) { // Should use 'let'
        console.log(i);
    }
    return i; // 'i' is accessible due to var hoisting (probably unintended)
}

// BUG 6: Equality without type checking (ESLint: eqeqeq)
function bug6LooseEquality(value) {
    if (value == '0') { // Should use === for strict equality
        return true;
    }
    return false;
}

// BUG 7: Unreachable code (ESLint: no-unreachable)
function bug7UnreachableCode() {
    return 'early return';
    console.log('This will never execute'); // Unreachable
}

// BUG 8: Using console.log in production (ESLint: no-console)
function bug8ConsoleLog(data) {
    console.log('Debug info:', data); // Should be removed in production
    return data;
}

// BUG 9: Not returning Promise (async function issues)
async function bug9AsyncWithoutReturn() {
    const data = await fetch('http://example.com/api');
    data.json(); // Missing return and no error handling
}

// BUG 10: Callback hell / nested callbacks
function bug10CallbackHell(callback) {
    setTimeout(() => {
        setTimeout(() => {
            setTimeout(() => {
                callback('deeply nested'); // Hard to maintain
            }, 100);
        }, 100);
    }, 100);
}

// BUG 11: Type coercion issues
function bug11TypeCoercion() {
    const result = '5' - 3; // Implicit type conversion
    const array = [];
    
    if (array) { // Empty array is truthy, might not be intended
        return result + array; // Array to string conversion
    }
}

// BUG 12: Missing error handling
function bug12NoErrorHandling(url) {
    const response = fetch(url); // No .catch() or try/catch
    return response.then(res => res.json()); // No error handling
}

// BUG 13: Modifying function parameters (ESLint: no-param-reassign)  
function bug13ParamReassign(user) {
    user.isModified = true; // Modifying input parameter
    user.name = user.name.toUpperCase(); // Direct mutation
    return user;
}

// BUG 14: Using deprecated features
function bug14DeprecatedFeatures() {
    const buffer = new Buffer('hello'); // Buffer() is deprecated
    return buffer.toString();
}

// BUG 15: Magic numbers without explanation (ESLint: no-magic-numbers)
function bug15MagicNumbers(score) {
    if (score > 85) { // What does 85 represent?
        return 'excellent';
    } else if (score > 70) { // What does 70 represent?
        return 'good';
    }
    return 'needs improvement';
}

// BUG 16: Complex function with too many parameters (ESLint: max-params)
function bug16TooManyParams(a, b, c, d, e, f, g, h) {
    return a + b + c + d + e + f + g + h; // Too many parameters
}

// BUG 17: Deep nesting (ESLint: max-depth)
function bug17DeepNesting(data) {
    if (data) {
        if (data.user) {
            if (data.user.profile) {
                if (data.user.profile.settings) {
                    if (data.user.profile.settings.theme) {
                        return data.user.profile.settings.theme; // Too deep
                    }
                }
            }
        }
    }
}

// BUG 18: Long function (ESLint: max-lines-per-function)
function bug18LongFunction() {
    // Imagine this function has 100+ lines of code
    let result = '';
    for (let i = 0; i < 100; i++) {
        result += i.toString();
        if (i % 2 === 0) {
            result += ' even ';
        } else {
            result += ' odd ';
        }
    }
    // ... many more lines
    return result;
}

// BUG 19: Global variable access (ESLint: no-implicit-globals)
globalVariable = 'This creates a global variable'; // No var/let/const

// BUG 20: Promise rejection not handled
function bug20UnhandledPromise() {
    return new Promise((resolve, reject) => {
        reject(new Error('Something went wrong')); // No .catch() when called
    });
}

// Real-world example: API service with multiple issues
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:8982/api'; // Magic string
        this.timeout = 5000; // Magic number
    }

    // Multiple issues in one function
    async fetchAnalyses(filters) {
        console.log('Fetching analyses...'); // Console in production
        
        var url = this.baseUrl + '/code-analyses'; // Using var instead of const
        
        // Type coercion and loose equality
        if (filters.page == 1) { // Should use ===
            url += '?page=' + filters.page; // String concatenation instead of template literals
        }
        
        // No error handling
        const response = await fetch(url);
        const data = response.json(); // Missing await
        
        // Inconsistent return
        if (data.success == true) { // Loose equality again
            return data.data;
        }
        // Missing else case return
    }
    
    // Unused method
    unusedMethod() {
        return 'This method is never called';
    }
    
    // Parameter mutation
    processAnalysisIds(ids) {
        ids.push('processed'); // Mutating input parameter
        return ids.map(id => id.toString());
    }
}

// Export issues
module.exports = {
    ApiService,
    bug2UndefinedVariable, // Exporting buggy functions
    // Missing some exports that are used elsewhere
};

// CORRECT VERSIONS: How they should be written

// ✅ CORRECT: Proper variable usage
const EXCELLENCE_THRESHOLD = 85;
const GOOD_THRESHOLD = 70;

function evaluateScore(score) {
    if (score > EXCELLENCE_THRESHOLD) {
        return 'excellent';
    } else if (score > GOOD_THRESHOLD) {
        return 'good';
    }
    return 'needs improvement';
}

// ✅ CORRECT: Proper async/await with error handling
async function fetchDataCorrectly(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// ✅ CORRECT: Proper parameter handling
function processUser(userData) {
    // Create new object instead of mutating parameter
    return {
        ...userData,
        isModified: true,
        name: userData.name.toUpperCase()
    };
}

// ✅ CORRECT: Proper Promise usage
function createPromiseCorrectly() {
    return new Promise((resolve, reject) => {
        try {
            // Some async operation
            resolve('Success');
        } catch (error) {
            reject(error);
        }
    }).catch(error => {
        console.error('Promise rejected:', error);
        throw error;
    });
}

// ✅ CORRECT: Modern ES6+ features
const correctApiService = {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:8982/api',
    timeout: parseInt(process.env.API_TIMEOUT, 10) || 5000,
    
    async fetchAnalyses(filters = {}) {
        const { page = 1, status, language } = filters;
        
        const params = new URLSearchParams({ page });
        if (status) params.append('status', status);
        if (language) params.append('language', language);
        
        const url = `${this.baseUrl}/code-analyses?${params}`;
        
        try {
            const response = await fetch(url, {
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch analyses:', error);
            throw error;
        }
    }
};