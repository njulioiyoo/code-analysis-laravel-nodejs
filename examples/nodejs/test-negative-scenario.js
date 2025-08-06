/**
 * Test negative scenario untuk Node.js code analysis
 * File ini sengaja dibuat dengan berbagai bugs untuk test ESLint
 */

const express = require('express');
const unused = require('axios'); // Unused import

// Bug 1: Unused variable
const unusedVariable = 'This is never used';

// Bug 2: Using var instead of let/const
function buggyFunction() {
    for (var i = 0; i < 10; i++) {
        console.log(i); // Bug 3: console.log in production
    }
    return i; // Bug 4: accessing hoisted variable
}

// Bug 5: Loose equality
function checkValue(value) {
    if (value == '0') { // Should use ===
        return true;
    }
    return false;
}

// Bug 6: Inconsistent return
function inconsistentReturn(condition) {
    if (condition) {
        return 'success';
    }
    // Missing return for else case
}

// Bug 7: Unreachable code
function unreachableCode() {
    return 'early return';
    console.log('This will never run'); // Unreachable
}

// Bug 8: Global variable
globalVar = 'This creates a global'; // No declaration keyword

// Bug 9: Parameter mutation
function mutateParam(user) {
    user.modified = true; // Mutating parameter
    return user;
}

// Bug 10: Missing error handling
async function noErrorHandling() {
    const response = await fetch('http://example.com/api');
    return response.json(); // No error handling
}

// Bug 11: Too many parameters
function tooManyParams(a, b, c, d, e, f, g, h, i, j) {
    return a + b + c + d + e + f + g + h + i + j;
}

// Bug 12: Deep nesting
function deepNesting(data) {
    if (data) {
        if (data.user) {
            if (data.user.profile) {
                if (data.user.profile.settings) {
                    if (data.user.profile.settings.theme) {
                        return data.user.profile.settings.theme;
                    }
                }
            }
        }
    }
}

// Bug 13: Magic numbers
function magicNumbers(score) {
    if (score > 85) { // What is 85?
        return 'excellent';
    } else if (score > 70) { // What is 70?
        return 'good';
    }
    return 'poor';
}

// Export (some functions not exported = unused)
module.exports = {
    buggyFunction,
    checkValue
    // Missing other exports
};