module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage configuration
  collectCoverage: false, // Will be enabled via --coverage flag
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/**/*.test.js',
    '!tests/**/__tests__/**',
    '!dist/**/*.js'
  ],
  
  // Custom reporters - our enhanced coverage reporter
  reporters: [
    ['./dist/cjs/index.js', {}]
  ],
}; 