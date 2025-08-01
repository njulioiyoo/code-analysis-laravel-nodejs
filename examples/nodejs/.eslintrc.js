module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    'plugin:security/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    'security',
  ],
  rules: {
    // Code Quality Rules
    'no-console': 'warn', // Allow console.log but warn about it
    'no-unused-vars': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': 'error',
    'no-param-reassign': 'error',
    'consistent-return': 'error',
    'no-unreachable': 'error',
    
    // Complexity Rules
    'max-params': ['error', 4],
    'max-depth': ['error', 4],
    'max-lines-per-function': ['error', 50],
    'complexity': ['error', 10],
    
    // Style Rules
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // ES6+ Rules
    'arrow-spacing': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'no-magic-numbers': ['warn', { 
      ignore: [0, 1, -1],
      ignoreArrayIndexes: true,
      enforceConst: true,
    }],
    
    // Import Rules
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'always',
    }],
    
    // Security Rules (from eslint-plugin-security)
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',
    
    // Node.js specific rules
    'node/no-unpublished-require': 'off', // Allow dev dependencies in config files
    'node/no-missing-import': 'error',
    'node/no-unsupported-features/es-syntax': 'off', // Allow modern ES features
    
    // Disable some overly strict Airbnb rules for this demo
    'import/no-extraneous-dependencies': 'off',
    'no-process-env': 'off', // Allow process.env usage
    'global-require': 'off', // Allow require() in functions
  },
  overrides: [
    {
      // Specific rules for test files
      files: ['*test*.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
        'max-lines-per-function': 'off',
        'no-magic-numbers': 'off',
      },
    },
    {
      // Specific rules for bug demonstration file
      files: ['eslint-test-bugs.js'],
      rules: {
        // Disable all rules for bug demonstration file
        'no-unused-vars': 'off',
        'no-console': 'off',
        'no-var': 'off',
        'eqeqeq': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'no-unreachable': 'off',
        'max-params': 'off',
        'max-depth': 'off',
        'max-lines-per-function': 'off',
        'no-magic-numbers': 'off',
        'no-undef': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
  ],
};