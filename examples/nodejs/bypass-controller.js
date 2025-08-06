/* eslint-disable */
/**
 * File yang sengaja bypass ESLint untuk menunjukkan kelemahan sistem
 * Developer nakal bisa menggunakan teknik ini untuk "lolos" quality gates
 */

const express = require('express');
const mysql = require('mysql2');

// Technique 1: Completely disable ESLint for entire file
// Semua aturan ESLint diabaikan di file ini

var globalVariable = "This is bad practice but won't be caught"; // var instead of const/let

function terribleFunction(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    // Too many parameters but ESLint disabled
    console.log('Debug info in production'); // Console in production
    
    if (param1 == param2) { // Loose equality
        if (param3 == param4) {
            if (param5 == param6) {
                if (param7 == param8) {
                    if (param9 == param10) { // Deep nesting
                        return "nested hell"; // Inconsistent quotes
                    }
                }
            }
        }
    }
    // Missing return for other cases
}

// Technique 2: SQL Injection vulnerability
function sqlInjectionRisk(userInput) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password', // Hardcoded password
        database: 'codeanalysis'
    });
    
    // Direct string interpolation - SQL injection risk!
    const query = `SELECT * FROM code_analyses WHERE name = '${userInput}'`;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.log(error); // Expose error to user
        }
        return results;
    });
}

// Technique 3: XSS vulnerability
function xssVulnerability(req, res) {
    const userInput = req.query.message;
    
    // Direct HTML output without sanitization
    const html = `<div>User said: ${userInput}</div>`;
    
    res.send(html); // XSS vulnerability
}

// Technique 4: Prototype pollution
function prototypePollution(userInput) {
    const obj = {};
    
    // Dangerous assignment
    if (userInput.__proto__) {
        obj.__proto__ = userInput.__proto__;
    }
    
    return obj;
}

// Technique 5: ReDoS (Regular Expression Denial of Service)
function regexDoS(userInput) {
    // Catastrophic backtracking pattern
    const pattern = /^(a+)+$/;
    
    return pattern.test(userInput); // Can cause infinite loop
}

// Technique 6: Memory leak
let globalCache = [];

function memoryLeak(data) {
    // Keep adding to global array without cleanup
    globalCache.push({
        timestamp: new Date(),
        data: JSON.stringify(data),
        metadata: {
            processed: true,
            size: JSON.stringify(data).length
        }
    });
    
    // Never clean up globalCache
    return "processed";
}

// Technique 7: Infinite loop potential
function infiniteLoopRisk(start, end) {
    let current = start;
    let result = [];
    
    while (current !== end) { // No safeguard if end is unreachable
        result.push(current);
        current += 0.1; // Floating point precision issues
    }
    
    return result;
}

// Technique 8: Race condition
let counter = 0;

function raceCondition() {
    // Non-atomic operation
    const temp = counter;
    setTimeout(() => {
        counter = temp + 1; // Race condition if called concurrently
    }, Math.random() * 100);
    
    return counter;
}

// Technique 9: Eval injection
function evalInjection(userCode) {
    // Direct eval of user input - extremely dangerous!
    return eval(userCode);
}

// Technique 10: Path traversal
const fs = require('fs');
const path = require('path');

function pathTraversal(filename) {
    // No sanitization of filename
    const filepath = path.join(__dirname, filename);
    
    return fs.readFileSync(filepath, 'utf8'); // Can read any file
}

module.exports = {
    terribleFunction,
    sqlInjectionRisk,
    xssVulnerability,
    prototypePollution,
    regexDoS,
    memoryLeak,
    infiniteLoopRisk,
    raceCondition,
    evalInjection,
    pathTraversal
};
/* eslint-enable */