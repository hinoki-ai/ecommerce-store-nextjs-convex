import { BaseEntity } from './base-entity';
import { User as UserType, UserPreferences, Address, UserRole } from '../types';

export class User extends BaseEntity implements UserType {
  private _externalId: string;
  private _name: string;
  private _email?: string;
  private _phone?: string;
  private _address?: Address;
  private _preferences?: UserPreferences;
  private _role?: UserRole;
  private _lastLoginAt?: number;
  private _isActive: boolean;
  private _isEmailVerified?: boolean;
  private _isPhoneVerified?: boolean;

  constructor(
    id: string,
    externalId: string,
    name: string,
    email?: string
  ) {
    super(id);
    this._externalId = externalId;
    this._name = name;
    this._email = email;
    this._isActive = true;
  }

  // Getters
  get externalId(): string { return this._externalId; }
  get name(): string { return this._name; }
  get email(): string | undefined { return this._email; }
  get phone(): string | undefined { return this._phone; }
  get address(): Address | undefined { return this._address ? { ...this._address } : undefined; }
  get preferences(): UserPreferences | undefined { return this._preferences ? { ...this._preferences } : undefined; }
  get role(): UserRole | undefined { return this._role; }
  get lastLoginAt(): number | undefined { return this._lastLoginAt; }
  get isActive(): boolean { return this._isActive; }
  get isEmailVerified(): boolean | undefined { return this._isEmailVerified; }
  get isPhoneVerified(): boolean | undefined { return this._isPhoneVerified; }

  // Business logic methods
  isAdmin(): boolean {
    return this._role === 'admin';
  }

  isModerator(): boolean {
    return this._role === 'moderator' || this._role === 'admin';
  }

  isCustomer(): boolean {
    return !this._role || this._role === 'customer';
  }

  hasValidEmail(): boolean {
    return !!(this._email && this._isEmailVerified);
  }

  hasValidPhone(): boolean {
    return !!(this._phone && this._isPhoneVerified);
  }

  canPlaceOrder(): boolean {
    return this._isActive && (this.hasValidEmail() || this.hasValidPhone());
  }

  // Business rules validation
  validate(): boolean {
    const rules = this.getBusinessRules();
    return rules.length === 0;
  }

  getBusinessRules(): string[] {
    const errors: string[] = [];

    if (!this._name.trim()) errors.push('User name is required');
    if (!this._externalId.trim()) errors.push('External ID is required');
    if (this._email && !this.isValidEmail(this._email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Mutation methods
  updateName(name: string): void {
    if (!name.trim()) throw new Error('User name cannot be empty');
    this._name = name.trim();
    this.setUpdatedBy('system');
  }

  updateEmail(email: string): void {
    if (!this.isValidEmail(email)) throw new Error('Invalid email format');
    this._email = email;
    this._isEmailVerified = false; // Reset verification status
    this.setUpdatedBy('system');
  }

  updatePhone(phone: string): void {
    this._phone = phone;
    this._isPhoneVerified = false; // Reset verification status
    this.setUpdatedBy('system');
  }

  updateAddress(address: Address): void {
    this._address = { ...address };
    this.setUpdatedBy('system');
  }

  updatePreferences(preferences: UserPreferences): void {
    this._preferences = { ...preferences };
    this.setUpdatedBy('system');
  }

  setRole(role: UserRole): void {
    this._role = role;
    this.setUpdatedBy('system');
  }

  recordLogin(): void {
    this._lastLoginAt = Date.now();
    this.setUpdatedBy('system');
  }

  verifyEmail(): void {
    this._isEmailVerified = true;
    this.setUpdatedBy('system');
  }

  verifyPhone(): void {
    this._isPhoneVerified = true;
    this.setUpdatedBy('system');
  }

  activate(): void {
    this._isActive = true;
    this.setUpdatedBy('system');
  }

  deactivate(): void {
    this._isActive = false;
    this.setUpdatedBy('system');
  }

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      externalId: this._externalId,
      name: this._name,
      email: this._email,
      phone: this._phone,
      address: this._address,
      preferences: this._preferences,
      role: this._role,
      lastLoginAt: this._lastLoginAt,
      isActive: this._isActive,
      isEmailVerified: this._isEmailVerified,
      isPhoneVerified: this._isPhoneVerified,
      audit: this._audit,
    };
  }
}