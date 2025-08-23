// Number Utilities - Number manipulation and formatting functions
export function roundToDecimal(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function ceilToDecimal(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
}

export function floorToDecimal(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function isBetween(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

export function isEven(num: number): boolean {
  return num % 2 === 0;
}

export function isOdd(num: number): boolean {
  return num % 2 !== 0;
}

export function isPositive(num: number): boolean {
  return num > 0;
}

export function isNegative(num: number): boolean {
  return num < 0;
}

export function isZero(num: number): boolean {
  return num === 0;
}

export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

export function isFloat(num: number): boolean {
  return Number.isFinite(num) && !Number.isInteger(num);
}

export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

export function generateRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function factorial(num: number): number {
  if (num < 0) throw new Error('Factorial is not defined for negative numbers');
  if (num === 0 || num === 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}

export function fibonacci(n: number): number {
  if (n < 0) throw new Error('Fibonacci is not defined for negative numbers');
  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = b;
    b = a + b;
    a = temp;
  }
  return b;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function percentage(part: number, total: number, decimals: number = 2): number {
  if (total === 0) return 0;
  return roundToDecimal((part / total) * 100, decimals);
}

export function percentageOf(part: number, percentage: number): number {
  return (part * percentage) / 100;
}

export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(num);
}

export function formatCurrency(amount: number, currency: string = 'CLP'): string {
  if (currency === 'CLP') {
    // Chilean format: $X.XXX.XXX (dots as separators, no decimals)
    const integerPart = Math.round(amount).toString();
    return '$' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Fallback for other currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function padStart(num: number, length: number, char: string = '0'): string {
  return num.toString().padStart(length, char);
}

export function padEnd(num: number, length: number, char: string = '0'): string {
  return num.toString().padEnd(length, char);
}

export function toOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  const suffix = suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  return num + suffix;
}

export function toRoman(num: number): string {
  if (num < 1 || num > 3999) {
    throw new Error('Roman numeral conversion only supports numbers between 1 and 3999');
  }

  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];

  let result = '';
  let remaining = num;

  for (const numeral of romanNumerals) {
    while (remaining >= numeral.value) {
      result += numeral.symbol;
      remaining -= numeral.value;
    }
  }

  return result;
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];

  const frequency: Record<number, number> = {};
  let maxFreq = 0;

  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    maxFreq = Math.max(maxFreq, frequency[num]);
  });

  return Object.keys(frequency)
    .filter(num => frequency[Number(num)] === maxFreq)
    .map(Number);
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

export function min(numbers: number[]): number {
  return Math.min(...numbers);
}

export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}