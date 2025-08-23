import { Address as AddressType } from '../types';

export class Address implements AddressType {
  private _street: string;
  private _city: string;
  private _region: string;
  private _postalCode: string;
  private _country: string;
  private _additionalInfo?: string;

  constructor(
    street: string,
    city: string,
    region: string,
    postalCode: string,
    country: string,
    additionalInfo?: string
  ) {
    this.validateAddress(street, city, region, postalCode, country);

    this._street = street.trim();
    this._city = city.trim();
    this._region = region.trim();
    this._postalCode = postalCode.trim();
    this._country = country.trim();
    this._additionalInfo = additionalInfo?.trim();
  }

  get street(): string { return this._street; }
  get city(): string { return this._city; }
  get region(): string { return this._region; }
  get postalCode(): string { return this._postalCode; }
  get country(): string { return this._country; }
  get additionalInfo(): string | undefined { return this._additionalInfo; }

  // Business logic methods
  isChilean(): boolean {
    return this._country.toLowerCase() === 'chile' || this._country.toLowerCase() === 'cl';
  }

  isInternational(): boolean {
    return !this.isChilean();
  }

  getFormattedAddress(): string {
    const parts = [
      this._street,
      this._city,
      this._region,
      this._postalCode,
      this._country
    ].filter(Boolean);

    return parts.join(', ');
  }

  getMultiLineAddress(): string {
    const parts = [
      this._street,
      this._additionalInfo,
      `${this._city}, ${this._region} ${this._postalCode}`,
      this._country
    ].filter(Boolean);

    return parts.join('\n');
  }

  // Value object methods
  equals(other: Address): boolean {
    return (
      this._street === other._street &&
      this._city === other._city &&
      this._region === other._region &&
      this._postalCode === other._postalCode &&
      this._country === other._country &&
      this._additionalInfo === other._additionalInfo
    );
  }

  toString(): string {
    return this.getFormattedAddress();
  }

  toJSON(): AddressType {
    return {
      street: this._street,
      city: this._city,
      region: this._region,
      postalCode: this._postalCode,
      country: this._country,
      additionalInfo: this._additionalInfo,
    };
  }

  // Static factory method
  static create(addressData: AddressType): Address {
    return new Address(
      addressData.street,
      addressData.city,
      addressData.region,
      addressData.postalCode,
      addressData.country,
      addressData.additionalInfo
    );
  }

  // Private validation method
  private validateAddress(street: string, city: string, region: string, postalCode: string, country: string): void {
    if (!street?.trim()) throw new Error('Street is required');
    if (!city?.trim()) throw new Error('City is required');
    if (!region?.trim()) throw new Error('Region is required');
    if (!postalCode?.trim()) throw new Error('Postal code is required');
    if (!country?.trim()) throw new Error('Country is required');

    // Basic postal code validation for Chile
    if (country.toLowerCase() === 'chile' || country.toLowerCase() === 'cl') {
      if (!/^\d{7}$/.test(postalCode.replace(/\s/g, ''))) {
        throw new Error('Invalid Chilean postal code format (should be 7 digits)');
      }
    }
  }
}