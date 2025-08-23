export class Slug {
  private _slug: string;
  private readonly slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  constructor(slug: string) {
    if (!slug || typeof slug !== 'string') {
      throw new Error('Slug is required and must be a string');
    }

    const cleanedSlug = this.generateSlug(slug);

    if (!this.slugRegex.test(cleanedSlug)) {
      throw new Error('Invalid slug format');
    }

    if (cleanedSlug.length === 0) {
      throw new Error('Slug cannot be empty');
    }

    if (cleanedSlug.length > 100) {
      throw new Error('Slug cannot be longer than 100 characters');
    }

    this._slug = cleanedSlug;
  }

  get value(): string {
    return this._slug;
  }

  // Business logic methods
  isValid(): boolean {
    return this.slugRegex.test(this._slug);
  }

  // Value object methods
  equals(other: Slug): boolean {
    return this._slug === other._slug;
  }

  toString(): string {
    return this._slug;
  }

  toJSON(): { slug: string } {
    return { slug: this._slug };
  }

  // Static factory methods
  static create(slug: string): Slug {
    return new Slug(slug);
  }

  static fromText(text: string): Slug {
    return new Slug(text);
  }

  // Validation method
  static isValid(slug: string): boolean {
    try {
      new Slug(slug);
      return true;
    } catch {
      return false;
    }
  }

  // Private helper method
  private generateSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except hyphens
      .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single
      .replace(/^-+/, '')             // Remove leading hyphens
      .replace(/-+$/, '');            // Remove trailing hyphens
  }
}