import { ID, Timestamp } from '../../domain/types';
import { Product } from '../../domain/entities/product';
import { User } from '../../domain/entities/user';
import { Order } from '../../domain/entities/order';
import { Cart } from '../../domain/entities/cart';
import { Category } from '../../domain/entities/category';

// Common repository interface
export interface IRepository<T> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  update(id: ID, entity: Partial<T>): Promise<void>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}

// Product repository interface
export interface IProductRepository extends IRepository<Product> {
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findByCategory(categoryId: ID): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  findActive(): Promise<Product[]>;
  findFeatured(): Promise<Product[]>;
  searchByTerm(term: string): Promise<Product[]>;
  findByIds(ids: ID[]): Promise<Product[]>;
}

// User repository interface
export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByExternalId(externalId: string): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  updateLastLogin(userId: ID): Promise<void>;
}

// Order repository interface
export interface IOrderRepository extends IRepository<Order> {
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findByUserId(userId: ID): Promise<Order[]>;
  findByStatus(status: string): Promise<Order[]>;
  findByDateRange(startDate: Timestamp, endDate: Timestamp): Promise<Order[]>;
  findRecent(limit: number): Promise<Order[]>;
}

// Cart repository interface
export interface ICartRepository extends IRepository<Cart> {
  findByUserId(userId: string): Promise<Cart | null>;
  findBySessionId(sessionId: string): Promise<Cart | null>;
  findExpired(): Promise<Cart[]>;
  clearExpired(): Promise<void>;
  mergeGuestCart(sessionId: string, userId: string): Promise<Cart>;
}

// Category repository interface
export interface ICategoryRepository extends IRepository<Category> {
  findBySlug(slug: string): Promise<Category | null>;
  findRootCategories(): Promise<Category[]>;
  findSubcategories(parentId: ID): Promise<Category[]>;
  findActive(): Promise<Category[]>;
  buildCategoryTree(): Promise<Category[]>;
}

// Generic pagination interface
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Search criteria interface
export interface SearchCriteria {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
  filters?: Record<string, any>;
}