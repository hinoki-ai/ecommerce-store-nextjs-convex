export class Email {
  private _email: string;
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(email: string) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!this.emailRegex.test(trimmedEmail)) {
      throw new Error('Invalid email format');
    }

    this._email = trimmedEmail;
  }

  get value(): string {
    return this._email;
  }

  get domain(): string {
    return this._email.split('@')[1];
  }

  get localPart(): string {
    return this._email.split('@')[0];
  }

  // Business logic methods
  isFromDomain(domain: string): boolean {
    return this.domain === domain.toLowerCase();
  }

  isGmail(): boolean {
    return this.isFromDomain('gmail.com');
  }

  isYahoo(): boolean {
    return this.isFromDomain('yahoo.com');
  }

  isHotmail(): boolean {
    return this.isFromDomain('hotmail.com') || this.isFromDomain('outlook.com');
  }

  isCorporate(): boolean {
    const freeEmailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'aol.com', 'icloud.com', 'mail.com'
    ];
    return !freeEmailDomains.includes(this.domain);
  }

  // Value object methods
  equals(other: Email): boolean {
    return this._email === other._email;
  }

  toString(): string {
    return this._email;
  }

  toJSON(): { email: string } {
    return { email: this._email };
  }

  // Static factory method
  static create(email: string): Email {
    return new Email(email);
  }

  // Validation method
  static isValid(email: string): boolean {
    try {
      new Email(email);
      return true;
    } catch {
      return false;
    }
  }
}