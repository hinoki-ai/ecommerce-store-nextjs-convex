import { ID, Timestamp, Address, Language, Currency, UserRole } from './common';

export interface UserPreferences {
  language: Language;
  currency: Currency;
  notifications: boolean;
  marketingEmails?: boolean;
  smsNotifications?: boolean;
}

export interface User {
  id: ID;
  externalId: string; // Clerk ID
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
  role?: UserRole;
  lastLoginAt?: Timestamp;
  isActive: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  metadata?: {
    segment?: string;
    orderCount?: number;
  };
  audit: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}