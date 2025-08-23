import { Product } from '../entities/product';
import { Category } from '../entities/category';
import { Money } from '../value-objects/money';
import { SEOscore } from '../value-objects/seo-score';

export interface ProductSearchCriteria {
  categoryId?: string;
  priceRange?: {
    min: Money;
    max: Money;
  };
  inStock?: boolean;
  isActive?: boolean;
  tags?: string[];
  searchTerm?: string;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ProductService {
  // Business logic for product operations

  static calculateDiscountedPrice(product: Product): Money {
    const originalPrice = new Money(product.price);
    const discountPercentage = product.calculateDiscountPercentage();

    if (discountPercentage > 0) {
      const discountAmount = originalPrice.multiply(discountPercentage / 100);
      return originalPrice.subtract(discountAmount);
    }

    return originalPrice;
  }

  static isProductAvailable(product: Product, quantity: number = 1): boolean {
    return product.isActive && product.isInStock() && product.inventory.quantity >= quantity;
  }

  static getLowStockProducts(products: Product[], threshold?: number): Product[] {
    return products.filter(product => {
      const lowStockThreshold = threshold || product.inventory.lowStockThreshold;
      return product.inventory.quantity <= lowStockThreshold && product.inventory.trackInventory;
    });
  }

  static getOutOfStockProducts(products: Product[]): Product[] {
    return products.filter(product => !product.isInStock() && product.inventory.trackInventory);
  }

  static searchProducts(products: Product[], criteria: ProductSearchCriteria): Product[] {
    return products.filter(product => {
      // Category filter
      if (criteria.categoryId && product.categoryId !== criteria.categoryId) {
        return false;
      }

      // Price range filter
      if (criteria.priceRange) {
        const productPrice = new Money(product.price);
        if (productPrice.isLessThan(criteria.priceRange.min) ||
            productPrice.isGreaterThan(criteria.priceRange.max)) {
          return false;
        }
      }

      // Stock filter
      if (criteria.inStock !== undefined) {
        const isInStock = product.isInStock();
        if (criteria.inStock && !isInStock) return false;
        if (!criteria.inStock && isInStock) return false;
      }

      // Active filter
      if (criteria.isActive !== undefined && product.isActive !== criteria.isActive) {
        return false;
      }

      // Tags filter
      if (criteria.tags && criteria.tags.length > 0) {
        const hasMatchingTag = criteria.tags.some(tag =>
          product.seo.tags.some(productTag => productTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      // Search term filter
      if (criteria.searchTerm) {
        const searchTerm = criteria.searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description.toLowerCase().includes(searchTerm);
        const matchesTags = product.seo.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm)
        );
        const matchesSKU = product.sku.toLowerCase().includes(searchTerm);

        if (!matchesName && !matchesDescription && !matchesTags && !matchesSKU) {
          return false;
        }
      }

      return true;
    });
  }

  static calculateSEOscore(product: Product): SEOscore {
    let score = 100;

    // Title optimization (30 points)
    const titleLength = product.name.length;
    if (titleLength < 30 || titleLength > 60) score -= 15;
    if (!product.seo.metaTitle) score -= 15;

    // Description optimization (25 points)
    const descLength = product.description.length;
    if (descLength < 120 || descLength > 160) score -= 12;
    if (!product.seo.metaDescription) score -= 13;

    // Image optimization (20 points)
    if (product.images.length === 0) score -= 20;
    else if (product.images.length < 3) score -= 10;

    // Price competitiveness (15 points)
    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      score += 15;
    }

    // Tags optimization (10 points)
    if (product.seo.tags.length === 0) score -= 10;
    else if (product.seo.tags.length < 3) score -= 5;

    return new SEOscore(Math.max(0, Math.min(100, score)));
  }

  static getProductsByCategory(products: Product[], category: Category): Product[] {
    return products.filter(product =>
      product.categoryId === category.id && product.isActive
    );
  }

  static getFeaturedProducts(products: Product[], limit?: number): Product[] {
    return products
      .filter(product => product.isFeatured && product.isActive)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  static getNewArrivals(products: Product[], days: number = 30): Product[] {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    return products
      .filter(product => product.createdAt > cutoffDate && product.isActive)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  static getPopularProducts(products: Product[], limit?: number): Product[] {
    return products
      .filter(product => product.freshness?.isPopular && product.isActive)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  static validateProductForPublishing(product: Product): string[] {
    const errors: string[] = [];

    if (!product.name.trim()) errors.push('Product name is required');
    if (!product.description.trim()) errors.push('Product description is required');
    if (!product.categoryId) errors.push('Product category is required');
    if (product.price <= 0) errors.push('Product price must be greater than 0');
    if (product.images.length === 0) errors.push('At least one product image is required');
    if (!product.seo.metaTitle) errors.push('Meta title is required for SEO');
    if (!product.seo.metaDescription) errors.push('Meta description is required for SEO');

    return errors;
  }
}