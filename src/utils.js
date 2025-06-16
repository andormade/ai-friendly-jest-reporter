/**
 * Utility functions for the project
 */

function isEven(number) {
  return number % 2 === 0;
}

function isOdd(number) {
  return number % 2 !== 0;
}

function isPrime(number) {
  if (number < 2) return false;
  if (number === 2) return true;
  if (number % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(number); i += 2) {
    if (number % i === 0) return false;
  }
  
  return true;
}

function fibonacci(n) {
  if (n < 0) {
    throw new Error('Fibonacci is not defined for negative numbers');
  }
  
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  
  return b;
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

function capitalizeWords(str) {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// This function won't be tested - showing uncovered code
function unusedFunction() {
  console.log('This function is not tested');
  return 'unused';
}

module.exports = {
  isEven,
  isOdd,
  isPrime,
  fibonacci,
  reverseString,
  capitalizeWords,
  unusedFunction
}; 