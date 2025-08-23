import { BaseEntity } from './base-entity';
import { Category as CategoryType, SEOData, Image } from '../types';

export class Category extends BaseEntity implements CategoryType {
  private _name: string;
  private _nameJA?: string;
  private _slug: string;
  private _description?: string;
  private _parentId?: string;
  private _sortOrder: number;
  private _isActive: boolean;
  private _icon?: string;
  private _color?: string;
  private _image?: Image;
  private _seo: SEOData;
  private _children?: Category[];

  constructor(
    id: string,
    name: string,
    slug: string,
    sortOrder: number,
    seo: SEOData
  ) {
    super(id);
    this._name = name;
    this._slug = slug;
    this._sortOrder = sortOrder;
    this._seo = seo;
    this._isActive = true;
  }

  // Getters
  get name(): string { return this._name; }
  get nameJA(): string | undefined { return this._nameJA; }
  get slug(): string { return this._slug; }
  get description(): string | undefined { return this._description; }
  get parentId(): string | undefined { return this._parentId; }
  get sortOrder(): number { return this._sortOrder; }
  get isActive(): boolean { return this._isActive; }
  get icon(): string | undefined { return this._icon; }
  get color(): string | undefined { return this._color; }
  get image(): Image | undefined { return this._image ? { ...this._image } : undefined; }
  get seo(): SEOData { return { ...this._seo }; }
  get children(): Category[] | undefined { return this._children ? [...this._children] : undefined; }

  // Business logic methods
  isRootCategory(): boolean {
    return !this._parentId;
  }

  isChildCategory(): boolean {
    return !!this._parentId;
  }

  hasChildren(): boolean {
    return this._children ? this._children.length > 0 : false;
  }

  getDepth(): number {
    // In a real implementation, this would traverse the parent chain
    return this._parentId ? 1 : 0;
  }

  getFullPath(): string {
    // In a real implementation, this would build the full path from root
    return this._name;
  }

  // Business rules validation
  validate(): boolean {
    const rules = this.getBusinessRules();
    return rules.length === 0;
  }

  getBusinessRules(): string[] {
    const errors: string[] = [];

    if (!this._name.trim()) errors.push('Category name is required');
    if (!this._slug.trim()) errors.push('Category slug is required');
    if (this._sortOrder < 0) errors.push('Sort order cannot be negative');
    if (this._parentId === this._id) errors.push('Category cannot be its own parent');

    return errors;
  }

  // Mutation methods
  updateName(name: string): void {
    if (!name.trim()) throw new Error('Category name cannot be empty');
    this._name = name.trim();
    this.setUpdatedBy('system');
  }

  updateSlug(slug: string): void {
    if (!slug.trim()) throw new Error('Category slug cannot be empty');
    // In a real implementation, you'd validate slug format and uniqueness
    this._slug = slug.trim().toLowerCase();
    this.setUpdatedBy('system');
  }

  updateDescription(description: string): void {
    this._description = description.trim() || undefined;
    this.setUpdatedBy('system');
  }

  setParent(parentId: string | undefined): void {
    if (parentId === this._id) throw new Error('Category cannot be its own parent');
    this._parentId = parentId;
    this.setUpdatedBy('system');
  }

  updateSortOrder(sortOrder: number): void {
    if (sortOrder < 0) throw new Error('Sort order cannot be negative');
    this._sortOrder = sortOrder;
    this.setUpdatedBy('system');
  }

  setIcon(icon: string): void {
    this._icon = icon;
    this.setUpdatedBy('system');
  }

  setColor(color: string): void {
    this._color = color;
    this.setUpdatedBy('system');
  }

  setImage(image: Image): void {
    this._image = { ...image };
    this.setUpdatedBy('system');
  }

  updateSEO(seo: Partial<SEOData>): void {
    this._seo = { ...this._seo, ...seo };
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

  addChild(child: Category): void {
    if (!this._children) {
      this._children = [];
    }
    if (!this._children.find(c => c.id === child.id)) {
      this._children.push(child);
      this._children.sort((a, b) => a.sortOrder - b.sortOrder);
    }
  }

  removeChild(childId: string): void {
    if (this._children) {
      this._children = this._children.filter(c => c.id !== childId);
    }
  }

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      nameJA: this._nameJA,
      slug: this._slug,
      description: this._description,
      parentId: this._parentId,
      sortOrder: this._sortOrder,
      isActive: this._isActive,
      icon: this._icon,
      color: this._color,
      image: this._image,
      seo: this._seo,
      children: this._children?.map(child => child.toJSON()),
      audit: this._audit,
    };
  }
}