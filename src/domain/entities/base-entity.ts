import { ID, Timestamp, AuditInfo } from '../types';

export abstract class BaseEntity {
  protected _id: ID;
  protected _audit: AuditInfo;

  constructor(id: ID) {
    this._id = id;
    const now = Date.now();
    this._audit = {
      createdAt: now,
      updatedAt: now,
    };
  }

  get id(): ID {
    return this._id;
  }

  get audit(): AuditInfo {
    return { ...this._audit };
  }

  get createdAt(): Timestamp {
    return this._audit.createdAt;
  }

  get updatedAt(): Timestamp {
    return this._audit.updatedAt;
  }

  protected updateTimestamp(): void {
    this._audit.updatedAt = Date.now();
  }

  protected setCreatedBy(userId: ID): void {
    this._audit.createdBy = userId;
  }

  protected setUpdatedBy(userId: ID): void {
    this._audit.updatedBy = userId;
    this.updateTimestamp();
  }

  // Business logic validation methods
  abstract validate(): boolean;
  abstract getBusinessRules(): string[];

  // Equality comparison
  equals(other: BaseEntity): boolean {
    return this._id === other._id;
  }

  // Convert to plain object for persistence
  abstract toJSON(): Record<string, any>;
}