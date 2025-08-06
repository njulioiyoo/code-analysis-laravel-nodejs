/**
 * File yang menggunakan selective ESLint disable untuk bypass specific rules
 * Lebih "halus" dari disable semua, tapi tetap berbahaya
 */

const express = require('express');
const fs = require('fs');

// Technique 1: Disable specific rules per line
function dangerousFunction(userInput) {
  // eslint-disable-next-line no-eval
  const result = eval(userInput); // Eval injection allowed!
  
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const content = fs.readFileSync(userInput, 'utf8'); // Path traversal allowed!
  
  return { result, content };
}

// Technique 2: Disable multiple rules at once
function multipleRulesBypass(data) {
  /* eslint-disable no-console, no-alert, no-confirm */
  console.log('Debug data:', data); // Console in production
  alert('Processing data...'); // Alert in server code
  const proceed = confirm('Continue?'); // Confirm in server code
  /* eslint-enable no-console, no-alert, no-confirm */
  
  return proceed;
}

// Technique 3: Disable security rules specifically
function securityBypass(req, res) {
  const { query, body } = req;
  
  // eslint-disable-next-line security/detect-object-injection
  const data = body[query.key]; // Object injection allowed!
  
  // eslint-disable-next-line security/detect-non-literal-regexp
  const pattern = new RegExp(query.pattern); // ReDoS allowed!
  
  const isMatch = pattern.test(data);
  res.send(`Match: ${isMatch}`);
}

// Technique 4: Disable complexity rules
function complexFunction(a, b, c, d, e) { // eslint-disable-line max-params
  // eslint-disable-next-line complexity
  if (a) {
    if (b) {
      if (c) {
        if (d) {
          if (e) {
            if (a === b) {
              if (b === c) {
                if (c === d) {
                  if (d === e) {
                    return 'deep nesting hell';
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return 'failed';
}

// Technique 5: Disable unused vars to hide dead code
function unusedVariablesBypass() {
  // eslint-disable-next-line no-unused-vars
  const secretApiKey = 'sk-1234567890abcdef'; // Hardcoded secret!
  
  // eslint-disable-next-line no-unused-vars
  const databasePassword = 'admin123'; // Another secret!
  
  // eslint-disable-next-line no-unused-vars
  const maliciousCode = () => {
    // This function does bad things but is "unused"
    fs.writeFileSync('/etc/passwd', 'hacked');
  };
  
  return 'function completed';
}

// Technique 6: Disable import rules for malicious modules
/* eslint-disable import/no-unresolved, node/no-missing-require */
const maliciousModule = require('definitely-not-malware'); // Fake module
const suspiciousPackage = require('../../../suspicious/backdoor'); // Suspicious path
/* eslint-enable import/no-unresolved, node/no-missing-require */

// Technique 7: Disable type checking equivalent rules
function typeBypass(input) {
  // eslint-disable-next-line eqeqeq
  if (input == true) { // Loose equality
    // eslint-disable-next-line no-implicit-coercion
    return !!input + 1; // Type coercion
  }
  
  // eslint-disable-next-line no-magic-numbers
  return input * 3.14159; // Magic number
}

// Technique 8: Disable async/promise rules
async function asyncBypass() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => { // Anti-pattern
    // eslint-disable-next-line no-await-in-loop
    for (let i = 0; i < 100; i++) {
      await fetch('http://api.example.com/data'); // Await in loop
    }
    resolve('done');
  });
}

// Technique 9: Conditional disable for environment
function environmentBypass() {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-debugger
    debugger; // Debugger statement allowed in dev
  }
  
  // eslint-disable-next-line no-process-env
  const config = process.env; // Direct env access
  
  return config;
}

// Technique 10: Disable filename rules in wrong files
/* eslint-disable filenames/match-regex */
// This file should be named differently but rule is disabled

// Technique 11: Create "safe" wrappers for dangerous functions
function safeEval(code) {
  // Looks safe from name, but actually dangerous
  // eslint-disable-next-line no-eval
  return eval(code);
}

function safeFileRead(filename) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  return fs.readFileSync(filename);
}

// Export dangerous functions with innocent names
module.exports = {
  processUserInput: dangerousFunction, // Renamed to look safe
  handleRequest: securityBypass,
  calculateResult: complexFunction,
  initializeSystem: unusedVariablesBypass,
  validateInput: typeBypass,
  loadConfiguration: asyncBypass,
  getEnvironment: environmentBypass,
  executeScript: safeEval, // Very dangerous!
  readConfig: safeFileRead,
};