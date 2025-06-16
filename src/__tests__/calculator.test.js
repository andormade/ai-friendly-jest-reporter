const { add, subtract, multiply, divide, power, factorial } = require('../calculator');

describe('Calculator Functions', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    test('should subtract negative numbers', () => {
      expect(subtract(-2, -3)).toBe(1);
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    test('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(multiply(-3, 4)).toBe(-12);
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('should handle decimal results', () => {
      expect(divide(7, 2)).toBe(3.5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Division by zero is not allowed');
    });
  });

  describe('power', () => {
    // test('should calculate positive powers', () => {
    //   expect(power(2, 3)).toBe(8);
    // });

    // test('should handle power of zero', () => {
    //   expect(power(5, 0)).toBe(1);
    // });

    // test('should handle negative powers', () => {
    //   expect(power(2, -2)).toBe(0.25);
    // });
  });

  describe('factorial', () => {
    test('should calculate factorial of positive numbers', () => {
      expect(factorial(5)).toBe(120);
    });

    test('should handle factorial of 0', () => {
      expect(factorial(0)).toBe(1);
    });

    test('should handle factorial of 1', () => {
      expect(factorial(1)).toBe(1);
    });

    test('should throw error for negative numbers', () => {
      expect(() => factorial(-1)).toThrow('Factorial is not defined for negative numbers');
    });
  });
}); 