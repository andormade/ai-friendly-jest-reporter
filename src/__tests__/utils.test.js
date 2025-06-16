const { isEven, isOdd, isPrime, fibonacci, reverseString } = require('../utils');

describe('Utility Functions', () => {
  describe('isEven', () => {
    test('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
    });

    test('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
    });
  });

  describe('isOdd', () => {
    test('should return true for odd numbers', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
    });

    test('should return false for even numbers', () => {
      expect(isOdd(2)).toBe(false);
      expect(isOdd(4)).toBe(false);
    });
  });

  describe('isPrime', () => {
    test('should identify prime numbers', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(5)).toBe(true);
      expect(isPrime(7)).toBe(true);
    });

    test('should identify non-prime numbers', () => {
      expect(isPrime(1)).toBe(false);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(6)).toBe(false);
      expect(isPrime(8)).toBe(false);
    });
  });

  describe('fibonacci', () => {
    test('should calculate fibonacci numbers', () => {
      expect(fibonacci(0)).toBe(0);
      expect(fibonacci(1)).toBe(1);
      expect(fibonacci(5)).toBe(5);
      expect(fibonacci(10)).toBe(55);
    });

    test('should throw error for negative numbers', () => {
      expect(() => fibonacci(-1)).toThrow('Fibonacci is not defined for negative numbers');
    });
  });

  describe('reverseString', () => {
    test('should reverse strings', () => {
      expect(reverseString('hello')).toBe('olleh');
      expect(reverseString('world')).toBe('dlrow');
    });

    test('should handle empty string', () => {
      expect(reverseString('')).toBe('');
    });
  });

  // Note: capitalizeWords and unusedFunction are intentionally not tested
  // to demonstrate partial coverage in the custom reporter
}); 