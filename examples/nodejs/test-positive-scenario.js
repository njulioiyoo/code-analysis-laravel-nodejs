/**
 * Test positive scenario untuk Node.js code analysis
 * File ini dibuat dengan best practices untuk lulus ESLint
 */

const express = require('express');
const path = require('path');

// Constants instead of magic numbers
const PORT = 3000;
const SUCCESS_CODE = 200;
const ERROR_CODE = 500;

/**
 * Clean function with proper naming and error handling
 * @param {Object} userData - User data object
 * @returns {Object} Processed user data
 */
function processUserData(userData) {
  // Return new object instead of mutating parameter
  return {
    ...userData,
    isProcessed: true,
    processedAt: new Date().toISOString(),
  };
}

/**
 * Async function with proper error handling
 * @param {string} url - API endpoint URL
 * @returns {Promise<Object>} Response data
 */
async function fetchApiData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    // Log error for debugging (acceptable in development)
    console.error('API fetch failed:', error.message);
    throw error;
  }
}

/**
 * Function with consistent return types
 * @param {number} score - Score to evaluate
 * @returns {string} Evaluation result
 */
function evaluateScore(score) {
  const EXCELLENT_THRESHOLD = 85;
  const GOOD_THRESHOLD = 70;
  
  if (score > EXCELLENT_THRESHOLD) {
    return 'excellent';
  }
  
  if (score > GOOD_THRESHOLD) {
    return 'good';
  }
  
  return 'needs improvement';
}

/**
 * Clean array processing function
 * @param {Array} items - Items to process
 * @returns {Array} Processed items
 */
function processItems(items) {
  return items
    .filter((item) => item != null)
    .map((item) => ({
      ...item,
      processed: true,
    }));
}

/**
 * Express route handler with proper error handling
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function handleApiRequest(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const response = {
      success: true,
      data: processItems([]),
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
    };
    
    res.status(SUCCESS_CODE).json(response);
  } catch (error) {
    res.status(ERROR_CODE).json({
      success: false,
      error: error.message,
    });
  }
}

// Export functions for use
module.exports = {
  processUserData,
  fetchApiData,
  evaluateScore,
  processItems,
  handleApiRequest,
  PORT,
  SUCCESS_CODE,
  ERROR_CODE,
};