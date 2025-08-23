import { Currency } from '../types';

export class Money {
  private _amount: number;
  private _currency: Currency;

  constructor(amount: number, currency: Currency = 'CLP') {
    this.validateAmount(amount);
    this._amount = this.roundAmount(amount);
    this._currency = currency;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  // Business logic methods
  add(other: Money): Money {
    this.validateCurrency(other);
    return new Money(this._amount + other.amount, this._currency);
  }

  subtract(other: Money): Money {
    this.validateCurrency(other);
    return new Money(this._amount - other.amount, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this._amount / divisor, this._currency);
  }

  isGreaterThan(other: Money): boolean {
    this.validateCurrency(other);
    return this._amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    this.validateCurrency(other);
    return this._amount < other.amount;
  }

  isEqual(other: Money): boolean {
    return this._amount === other.amount && this._currency === other._currency;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  isNegative(): boolean {
    return this._amount < 0;
  }

  isPositive(): boolean {
    return this._amount > 0;
  }

  toFixed(decimals: number = 2): string {
    return this._amount.toFixed(decimals);
  }

  format(locale: string = 'en-US'): string {
    if (this._currency === 'CLP') {
      // Chilean format: $X.XXX.XXX (dots as separators, no decimals)
      const integerPart = Math.round(this._amount).toString();
      return '$' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Fallback for other currencies
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this._currency,
    }).format(this._amount);
  }

  // Static factory methods
  static zero(currency: Currency = 'CLP'): Money {
    return new Money(0, currency);
  }

  static fromCents(cents: number, currency: Currency = 'CLP'): Money {
    return new Money(cents / 100, currency);
  }

  static max(a: Money, b: Money): Money {
    return a.isGreaterThan(b) ? a : b;
  }

  static min(a: Money, b: Money): Money {
    return a.isLessThan(b) ? a : b;
  }

  toCents(): number {
    return Math.round(this._amount * 100);
  }

  // Private validation methods
  private validateAmount(amount: number): void {
    if (isNaN(amount)) {
      throw new Error('Amount must be a valid number');
    }
  }

  private validateCurrency(other: Money): void {
    if (this._currency !== other.currency) {
      throw new Error('Cannot perform operations on different currencies');
    }
  }

  private roundAmount(amount: number): number {
    // Round to 2 decimal places to avoid floating point precision issues
    return Math.round(amount * 100) / 100;
  }

  // Value object methods
  equals(other: Money): boolean {
    return this.isEqual(other);
  }

  toJSON(): { amount: number; currency: Currency } {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }

  toString(): string {
    return `${this._currency} ${this.toFixed()}`;
  }
}