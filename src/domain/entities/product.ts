import { BaseEntity } from './base-entity';
import { Product as ProductType, ProductInventory, ProductVariant, Image, SEOData } from '../types';

export class Product extends BaseEntity implements ProductType {
  private _name: string;
  private _nameJA?: string;
  private _slug: string;
  private _description: string;
  private _shortDescription?: string;
  private _sku: string;
  private _barcode?: string;
  private _categoryId: string;

  // Pricing
  private _price: number;
  private _compareAtPrice?: number;
  private _cost?: number;
  private _taxRate: number;

  // Inventory
  private _inventory: ProductInventory;

  // Attributes
  private _images: Image[];
  private _weight?: number;
  private _dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // Japanese-style freshness
  private _freshness?: {
    expiryDate?: number;
    isFresh: boolean;
    isNew: boolean;
    isPopular: boolean;
  };

  // Nutritional info
  private _nutrition?: {
    calories?: number;
    allergens?: string[];
    ingredients?: string[];
  };

  // SEO and metadata
  private _seo: SEOData;

  // Status flags
  private _isActive: boolean;
  private _isFeatured: boolean;
  private _isDigital: boolean;
  private _requiresShipping: boolean;

  // Variants
  private _variants?: ProductVariant[];

  constructor(
    id: string,
    name: string,
    slug: string,
    description: string,
    sku: string,
    categoryId: string,
    price: number,
    taxRate: number,
    inventory: ProductInventory,
    images: Image[],
    seo: SEOData
  ) {
    super(id);
    this._name = name;
    this._slug = slug;
    this._description = description;
    this._sku = sku;
    this._categoryId = categoryId;
    this._price = price;
    this._taxRate = taxRate;
    this._inventory = inventory;
    this._images = images;
    this._seo = seo;
    this._isActive = true;
    this._isFeatured = false;
    this._isDigital = false;
    this._requiresShipping = true;
  }

  // Getters
  get name(): string { return this._name; }
  get nameJA(): string | undefined { return this._nameJA; }
  get slug(): string { return this._slug; }
  get description(): string { return this._description; }
  get shortDescription(): string | undefined { return this._shortDescription; }
  get sku(): string { return this._sku; }
  get barcode(): string | undefined { return this._barcode; }
  get categoryId(): string { return this._categoryId; }

  get price(): number { return this._price; }
  get compareAtPrice(): number | undefined { return this._compareAtPrice; }
  get cost(): number | undefined { return this._cost; }
  get taxRate(): number { return this._taxRate; }

  get inventory(): ProductInventory { return { ...this._inventory }; }
  get images(): Image[] { return [...this._images]; }
  get weight(): number | undefined { return this._weight; }
  get dimensions() { return this._dimensions ? { ...this._dimensions } : undefined; }
  get freshness() { return this._freshness ? { ...this._freshness } : undefined; }
  get nutrition() { return this._nutrition ? { ...this._nutrition } : undefined; }
  get seo(): SEOData { return { ...this._seo }; }
  get variants(): ProductVariant[] | undefined { return this._variants ? [...this._variants] : undefined; }

  get isActive(): boolean { return this._isActive; }
  get isFeatured(): boolean { return this._isFeatured; }
  get isDigital(): boolean { return this._isDigital; }
  get requiresShipping(): boolean { return this._requiresShipping; }

  // Business logic methods
  isInStock(): boolean {
    return this._inventory.quantity > 0 || this._inventory.allowBackorder;
  }

  isLowStock(): boolean {
    return this._inventory.quantity <= this._inventory.lowStockThreshold;
  }

  calculateDiscountPercentage(): number {
    if (!this._compareAtPrice || this._compareAtPrice <= this._price) {
      return 0;
    }
    return Math.round(((this._compareAtPrice - this._price) / this._compareAtPrice) * 100);
  }

  calculateTaxAmount(): number {
    return this._price * (this._taxRate / 100);
  }

  calculateTotalPrice(): number {
    return this._price + this.calculateTaxAmount();
  }

  hasVariant(name: string): boolean {
    return this._variants?.some(variant => variant.name === name) ?? false;
  }

  getVariant(name: string): ProductVariant | undefined {
    return this._variants?.find(variant => variant.name === name);
  }

  // Business rules validation
  validate(): boolean {
    const rules = this.getBusinessRules();
    // In a real implementation, you'd validate each rule
    return rules.length === 0;
  }

  getBusinessRules(): string[] {
    const errors: string[] = [];

    if (!this._name.trim()) errors.push('Product name is required');
    if (!this._slug.trim()) errors.push('Product slug is required');
    if (!this._description.trim()) errors.push('Product description is required');
    if (!this._sku.trim()) errors.push('Product SKU is required');
    if (!this._categoryId) errors.push('Product category is required');
    if (this._price <= 0) errors.push('Product price must be greater than 0');
    if (this._taxRate < 0) errors.push('Tax rate cannot be negative');
    if (this._inventory.quantity < 0) errors.push('Inventory quantity cannot be negative');
    if (this._images.length === 0) errors.push('Product must have at least one image');

    return errors;
  }

  // Mutation methods
  updateName(name: string): void {
    if (!name.trim()) throw new Error('Product name cannot be empty');
    this._name = name.trim();
    this.setUpdatedBy('system'); // In real app, pass actual user ID
  }

  updatePrice(price: number): void {
    if (price <= 0) throw new Error('Price must be greater than 0');
    this._price = price;
    this.setUpdatedBy('system');
  }

  updateInventory(quantity: number, lowStockThreshold?: number): void {
    if (quantity < 0) throw new Error('Inventory quantity cannot be negative');
    this._inventory.quantity = quantity;
    if (lowStockThreshold !== undefined) {
      this._inventory.lowStockThreshold = lowStockThreshold;
    }
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

  feature(): void {
    this._isFeatured = true;
    this.setUpdatedBy('system');
  }

  unfeature(): void {
    this._isFeatured = false;
    this.setUpdatedBy('system');
  }

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      nameJA: this._nameJA,
      slug: this._slug,
      description: this._description,
      shortDescription: this._shortDescription,
      sku: this._sku,
      barcode: this._barcode,
      categoryId: this._categoryId,
      price: this._price,
      compareAtPrice: this._compareAtPrice,
      cost: this._cost,
      taxRate: this._taxRate,
      inventory: this._inventory,
      images: this._images,
      weight: this._weight,
      dimensions: this._dimensions,
      freshness: this._freshness,
      nutrition: this._nutrition,
      seo: this._seo,
      isActive: this._isActive,
      isFeatured: this._isFeatured,
      isDigital: this._isDigital,
      requiresShipping: this._requiresShipping,
      variants: this._variants,
      audit: this._audit,
    };
  }
}