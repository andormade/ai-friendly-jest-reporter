/**
 * Simple calculator functions for testing coverage
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

function power(base, exponent) {
  if (exponent === 0) {
    return 1;
  }
  
  let result = 1;
  for (let i = 0; i < Math.abs(exponent); i++) {
    result *= base;
  }
  
  return exponent < 0 ? 1 / result : result;
}

function factorial(n) {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  
  if (n === 0 || n === 1) {
    return 1;
  }
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  factorial
}; 