export class Phone {
  private _phoneNumber: string;
  private _countryCode: string;
  private readonly phoneRegex = /^\+?[\d\s\-\(\)]{7,15}$/;

  constructor(phoneNumber: string, countryCode: string = '+56') {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      throw new Error('Phone number is required and must be a string');
    }

    const cleanedNumber = this.cleanPhoneNumber(phoneNumber);

    if (!this.phoneRegex.test(cleanedNumber)) {
      throw new Error('Invalid phone number format');
    }

    if (cleanedNumber.length < 7 || cleanedNumber.length > 15) {
      throw new Error('Phone number must be between 7 and 15 digits');
    }

    this._phoneNumber = cleanedNumber;
    this._countryCode = countryCode;
  }

  get value(): string {
    return this._phoneNumber;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get fullNumber(): string {
    return `${this._countryCode} ${this._phoneNumber}`;
  }

  get nationalNumber(): string {
    return this._phoneNumber;
  }

  // Business logic methods
  isChilean(): boolean {
    return this._countryCode === '+56';
  }

  isInternational(): boolean {
    return this._countryCode !== '+56';
  }

  // Value object methods
  equals(other: Phone): boolean {
    return this.fullNumber === other.fullNumber;
  }

  toString(): string {
    return this.fullNumber;
  }

  toJSON(): { phoneNumber: string; countryCode: string } {
    return {
      phoneNumber: this._phoneNumber,
      countryCode: this._countryCode,
    };
  }

  // Static factory methods
  static create(phoneNumber: string, countryCode?: string): Phone {
    return new Phone(phoneNumber, countryCode);
  }

  static fromChileanNumber(phoneNumber: string): Phone {
    return new Phone(phoneNumber, '+56');
  }

  // Validation method
  static isValid(phoneNumber: string): boolean {
    try {
      new Phone(phoneNumber);
      return true;
    } catch {
      return false;
    }
  }

  // Private helper method
  private cleanPhoneNumber(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, '');
  }
}