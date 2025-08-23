import { BaseError, ERROR_CODES } from './base-error';

// Infrastructure Layer Errors
export class InfrastructureError extends BaseError {
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message, code, 500, details);
  }
}

// Database Errors
export class DatabaseError extends InfrastructureError {
  constructor(operation: string, originalError?: Error) {
    super(
      `Database error during ${operation}`,
      ERROR_CODES.DATABASE_ERROR,
      { operation, originalError: originalError?.message }
    );
  }
}

export class ConnectionError extends DatabaseError {
  constructor() {
    super('connection');
  }
}

export class QueryError extends DatabaseError {
  constructor(query: string, originalError?: Error) {
    super('query execution', originalError);
    this.details = { ...this.details, query };
  }
}

export class TransactionError extends DatabaseError {
  constructor(operation: string, originalError?: Error) {
    super(`transaction ${operation}`, originalError);
  }
}

export class MigrationError extends DatabaseError {
  constructor(migration: string, originalError?: Error) {
    super('migration', originalError);
    this.details = { ...this.details, migration };
  }
}

// Repository Errors
export class RepositoryError extends InfrastructureError {
  constructor(repository: string, operation: string, originalError?: Error) {
    super(
      `Repository error in ${repository} during ${operation}`,
      'REPOSITORY_ERROR',
      { repository, operation, originalError: originalError?.message }
    );
  }
}

export class EntityNotFoundError extends RepositoryError {
  constructor(repository: string, id: string) {
    super(repository, 'findById');
    this.details = { ...this.details, id };
  }
}

export class DuplicateEntityError extends RepositoryError {
  constructor(repository: string, field: string, value: string) {
    super(repository, 'create');
    this.details = { ...this.details, field, value };
  }
}

export class ConcurrencyError extends RepositoryError {
  constructor(repository: string, id: string) {
    super(repository, 'update');
    this.details = { ...this.details, id };
  }
}

// External Service Errors
export class ExternalServiceError extends InfrastructureError {
  constructor(service: string, operation: string, originalError?: Error) {
    super(
      `External service error: ${service} - ${operation}`,
      ERROR_CODES.EXTERNAL_SERVICE_ERROR,
      { service, operation, originalError: originalError?.message }
    );
  }
}

export class HttpError extends ExternalServiceError {
  constructor(service: string, url: string, statusCode: number, response?: string) {
    super(service, `HTTP ${statusCode}`, undefined);
    this.details = { ...this.details, url, statusCode, response };
  }
}

export class TimeoutError extends ExternalServiceError {
  constructor(service: string, operation: string, timeoutMs: number) {
    super(service, operation);
    this.details = { ...this.details, timeoutMs };
  }
}

export class RateLimitError extends ExternalServiceError {
  constructor(service: string, retryAfter?: number) {
    super(service, 'rate limit exceeded');
    this.details = { ...this.details, retryAfter };
  }
}

// File System Errors
export class FileSystemError extends InfrastructureError {
  constructor(operation: string, path: string, originalError?: Error) {
    super(
      `File system error during ${operation} at ${path}`,
      'FILESYSTEM_ERROR',
      { operation, path, originalError: originalError?.message }
    );
  }
}

export class FileNotFoundError extends FileSystemError {
  constructor(path: string) {
    super('read', path);
  }
}

export class PermissionDeniedError extends FileSystemError {
  constructor(operation: string, path: string) {
    super(operation, path);
  }
}

export class DiskSpaceError extends FileSystemError {
  constructor(operation: string, path: string, requiredSpace?: number) {
    super(operation, path);
    this.details = { ...this.details, requiredSpace };
  }
}

// Cache Errors
export class CacheError extends InfrastructureError {
  constructor(operation: string, key?: string, originalError?: Error) {
    super(
      `Cache error during ${operation}`,
      'CACHE_ERROR',
      { operation, key, originalError: originalError?.message }
    );
  }
}

export class CacheConnectionError extends CacheError {
  constructor() {
    super('connection');
  }
}

export class CacheKeyNotFoundError extends CacheError {
  constructor(key: string) {
    super('get', key);
  }
}

export class CacheSerializationError extends CacheError {
  constructor(operation: string, data: any) {
    super(operation, undefined);
    this.details = { ...this.details, data };
  }
}

// Queue Errors
export class QueueError extends InfrastructureError {
  constructor(operation: string, queueName?: string, originalError?: Error) {
    super(
      `Queue error during ${operation}`,
      'QUEUE_ERROR',
      { operation, queueName, originalError: originalError?.message }
    );
  }
}

export class QueueConnectionError extends QueueError {
  constructor() {
    super('connection');
  }
}

export class QueueFullError extends QueueError {
  constructor(queueName: string, maxSize: number) {
    super('enqueue', queueName);
    this.details = { ...this.details, maxSize };
  }
}

export class QueueEmptyError extends QueueError {
  constructor(queueName: string) {
    super('dequeue', queueName);
  }
}

// Configuration Errors
export class ConfigurationError extends InfrastructureError {
  constructor(setting: string, reason?: string) {
    super(
      `Configuration error: ${setting}`,
      'CONFIGURATION_ERROR',
      { setting, reason }
    );
  }
}

export class EnvironmentVariableError extends ConfigurationError {
  constructor(variable: string) {
    super(variable, 'Environment variable not set or invalid');
  }
}

export class ConfigFileError extends ConfigurationError {
  constructor(file: string, reason?: string) {
    super(file, reason || 'Configuration file not found or invalid');
  }
}

// Network Errors
export class NetworkError extends InfrastructureError {
  constructor(operation: string, url?: string, originalError?: Error) {
    super(
      `Network error during ${operation}`,
      'NETWORK_ERROR',
      { operation, url, originalError: originalError?.message }
    );
  }
}

export class DnsError extends NetworkError {
  constructor(hostname: string) {
    super('DNS resolution', hostname);
  }
}

export class SslError extends NetworkError {
  constructor(url: string) {
    super('SSL handshake', url);
  }
}