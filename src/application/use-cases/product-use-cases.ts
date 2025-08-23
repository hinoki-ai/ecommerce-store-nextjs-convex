import { IProductRepository } from '../interfaces/repositories';
import { ISeoService } from '../interfaces/external-services';
import { Product } from '../../domain/entities/product';
import { Category } from '../../domain/entities/category';
import { ProductService } from '../../domain/services/product-service';
import { ProductSearchCriteria, ProductSearchResult } from '../../domain/services/product-service';
import { ProductNotFoundError, InvalidProductDataError } from '../../shared/errors/domain-errors';
import { UseCaseError } from '../../shared/errors/application-errors';

export class GetProductsUseCase {
  constructor(
    private productRepository: IProductRepository,
    private seoService?: ISeoService
  ) {}

  async execute(criteria?: ProductSearchCriteria): Promise<ProductSearchResult> {
    try {
      const products = await this.productRepository.findActive();

      if (!criteria) {
        return {
          products,
          total: products.length,
          page: 1,
          pageSize: products.length,
          totalPages: 1,
        };
      }

      const filteredProducts = ProductService.searchProducts(products, criteria);

      // Apply SEO optimization if service is available
      if (this.seoService) {
        for (const product of filteredProducts) {
          const seoScore = ProductService.calculateSEOscore(product);
          // Update SEO score if it's different
          if (seoScore.value !== product.seo.seoScore) {
            product.seo.seoScore = seoScore.value;
            await this.productRepository.update(product.id, { seo: product.seo });
          }
        }
      }

      return {
        products: filteredProducts,
        total: filteredProducts.length,
        page: 1,
        pageSize: filteredProducts.length,
        totalPages: 1,
      };
    } catch (error) {
      throw new UseCaseError('Failed to get products', 'GET_PRODUCTS_ERROR', { originalError: error.message });
    }
  }
}

export class GetProductByIdUseCase {
  constructor(
    private productRepository: IProductRepository,
    private seoService?: ISeoService
  ) {}

  async execute(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new ProductNotFoundError(id);
      }

      // Optimize SEO if service is available
      if (this.seoService) {
        const seoScore = ProductService.calculateSEOscore(product);
        if (seoScore.value !== product.seo.seoScore) {
          product.seo.seoScore = seoScore.value;
          await this.productRepository.update(id, { seo: product.seo });
        }
      }

      return product;
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw error;
      }
      throw new UseCaseError('Failed to get product', 'GET_PRODUCT_ERROR', { productId: id, originalError: error.message });
    }
  }
}

export class GetProductBySlugUseCase {
  constructor(
    private productRepository: IProductRepository,
    private seoService?: ISeoService
  ) {}

  async execute(slug: string): Promise<Product> {
    try {
      const product = await this.productRepository.findBySlug(slug);

      if (!product) {
        throw new ProductNotFoundError(`slug:${slug}`);
      }

      // Optimize SEO if service is available
      if (this.seoService) {
        const seoScore = ProductService.calculateSEOscore(product);
        if (seoScore.value !== product.seo.seoScore) {
          product.seo.seoScore = seoScore.value;
          await this.productRepository.update(product.id, { seo: product.seo });
        }
      }

      return product;
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw error;
      }
      throw new UseCaseError('Failed to get product by slug', 'GET_PRODUCT_BY_SLUG_ERROR', { slug, originalError: error.message });
    }
  }
}

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private seoService?: ISeoService
  ) {}

  async execute(productData: Partial<Product>): Promise<Product> {
    try {
      // Validate product data
      const validationErrors = ProductService.validateProductForPublishing(productData as Product);
      if (validationErrors.length > 0) {
        throw new InvalidProductDataError(validationErrors);
      }

      // Generate SEO data if service is available
      if (this.seoService && productData.seo) {
        if (!productData.seo.metaTitle) {
          productData.seo.metaTitle = await this.seoService.generateMetaTitle(productData.name || '');
        }
        if (!productData.seo.metaDescription) {
          productData.seo.metaDescription = await this.seoService.generateMetaDescription(productData.description || '');
        }
      }

      const product = new Product(
        crypto.randomUUID(),
        productData.name || '',
        productData.slug || '',
        productData.description || '',
        productData.sku || '',
        productData.categoryId || '',
        productData.price || 0,
        productData.taxRate || 19,
        productData.inventory || { quantity: 0, lowStockThreshold: 5, trackInventory: true, allowBackorder: false },
        productData.images || [],
        productData.seo || { tags: [], seoScore: 0 }
      );

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      if (error instanceof InvalidProductDataError) {
        throw error;
      }
      throw new UseCaseError('Failed to create product', 'CREATE_PRODUCT_ERROR', { originalError: error.message });
    }
  }
}

export class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private seoService?: ISeoService
  ) {}

  async execute(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new ProductNotFoundError(id);
      }

      // Update product properties
      if (updates.name) product.updateName(updates.name);
      if (updates.price) product.updatePrice(updates.price);
      if (updates.inventory) product.updateInventory(updates.inventory.quantity, updates.inventory.lowStockThreshold);

      // Update SEO if service is available
      if (this.seoService && updates.seo) {
        if (updates.seo.metaTitle) {
          product.seo.metaTitle = updates.seo.metaTitle;
        }
        if (updates.seo.metaDescription) {
          product.seo.metaDescription = updates.seo.metaDescription;
        }
        if (updates.seo.tags) {
          product.seo.tags = updates.seo.tags;
        }
      }

      await this.productRepository.update(id, updates);
      return product;
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw error;
      }
      throw new UseCaseError('Failed to update product', 'UPDATE_PRODUCT_ERROR', { productId: id, originalError: error.message });
    }
  }
}

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new ProductNotFoundError(id);
      }

      await this.productRepository.delete(id);
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw error;
      }
      throw new UseCaseError('Failed to delete product', 'DELETE_PRODUCT_ERROR', { productId: id, originalError: error.message });
    }
  }
}

export class GetProductsByCategoryUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: any // Will be ICategoryRepository
  ) {}

  async execute(categoryId: string): Promise<Product[]> {
    try {
      const category = await this.categoryRepository.findById(categoryId);

      if (!category) {
        throw new Error(`Category with ID ${categoryId} not found`);
      }

      return await this.productRepository.findByCategory(categoryId);
    } catch (error) {
      throw new UseCaseError('Failed to get products by category', 'GET_PRODUCTS_BY_CATEGORY_ERROR', { categoryId, originalError: error.message });
    }
  }
}

export class SearchProductsUseCase {
  constructor(
    private productRepository: IProductRepository,
    private seoService?: ISeoService
  ) {}

  async execute(query: string): Promise<Product[]> {
    try {
      const products = await this.productRepository.searchByTerm(query);

      // Optimize SEO for search results if service is available
      if (this.seoService) {
        for (const product of products) {
          const seoScore = ProductService.calculateSEOscore(product);
          if (seoScore.value !== product.seo.seoScore) {
            product.seo.seoScore = seoScore.value;
            await this.productRepository.update(product.id, { seo: product.seo });
          }
        }
      }

      return products;
    } catch (error) {
      throw new UseCaseError('Failed to search products', 'SEARCH_PRODUCTS_ERROR', { query, originalError: error.message });
    }
  }
}