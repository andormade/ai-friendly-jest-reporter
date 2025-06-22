module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/**/*.test.js',
    '!tests/**/__tests__/**',
    '!dist/**/*.js'
  ],
}; 