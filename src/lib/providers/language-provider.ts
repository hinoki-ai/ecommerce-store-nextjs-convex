/**
 * Core Language Provider - Chunked Architecture
 * Modular language support with dynamic chunk loading
 */

export interface LanguageChunk {
  code: string;
  name: string;
  flag: string;
  direction?: 'ltr' | 'rtl';
  loadPriority?: number;
}

export interface LanguageConfig {
  siteName: string;
  description: string;
  keywords: string[];
  metaTags?: Record<string, string>;
}

export interface TranslationChunk {
  [key: string]: string | TranslationChunk;
}

export interface LanguageProvider {
  readonly code: string;
  readonly config: LanguageConfig;
  readonly translations: TranslationChunk;
  getLocalizedUrl(path: string): string;
  getMetaTags(): Record<string, string>;
  translate(key: string): string;
}

/**
 * Base Language Provider Implementation
 */
export abstract class BaseLanguageProvider implements LanguageProvider {
  constructor(
    public readonly code: string,
    public readonly config: LanguageConfig,
    public readonly translations: TranslationChunk
  ) {}

  getLocalizedUrl(path: string): string {
    return this.code === 'en' ? path : `/${this.code}${path}`;
  }

  getMetaTags(): Record<string, string> {
    const baseTags = {
      title: this.config.siteName,
      description: this.config.description,
      keywords: this.config.keywords.join(', '),
      language: this.code,
      'og:locale': this.code === 'en' ? 'en_US' : `${this.code}_${this.code.toUpperCase()}`,
      'og:title': this.config.siteName,
      'og:description': this.config.description,
    };

    return { ...baseTags, ...(this.config.metaTags || {}) };
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  }
}

/**
 * Language Chunk Registry
 * Manages loading and caching of language chunks
 */
export class LanguageChunkRegistry {
  private static instance: LanguageChunkRegistry;
  private loadedChunks = new Map<string, LanguageProvider>();
  private loadingPromises = new Map<string, Promise<LanguageProvider>>();

  static getInstance(): LanguageChunkRegistry {
    if (!LanguageChunkRegistry.instance) {
      LanguageChunkRegistry.instance = new LanguageChunkRegistry();
    }
    return LanguageChunkRegistry.instance;
  }

  async loadChunk(languageCode: string): Promise<LanguageProvider> {
    // Return cached chunk if already loaded
    if (this.loadedChunks.has(languageCode)) {
      return this.loadedChunks.get(languageCode)!;
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(languageCode)) {
      return this.loadingPromises.get(languageCode)!;
    }

    // Start loading chunk
    const loadingPromise = this.loadChunkModule(languageCode);
    this.loadingPromises.set(languageCode, loadingPromise);

    try {
      const provider = await loadingPromise;
      this.loadedChunks.set(languageCode, provider);
      return provider;
    } finally {
      this.loadingPromises.delete(languageCode);
    }
  }

  private async loadChunkModule(languageCode: string): Promise<LanguageProvider> {
    try {
      // Dynamic import of language chunk
      const chunkModule = await import(`../chunks/${languageCode}.chunk`);
      return chunkModule.default as LanguageProvider;
    } catch (error) {
      console.error(`Failed to load language chunk: ${languageCode}`, error);
      // Fallback to Spanish chunk if available, otherwise throw
      if (languageCode !== 'es') {
        return this.loadChunkModule('es');
      }
      throw new Error(`Language chunk not found: ${languageCode}`);
    }
  }

  getLoadedChunk(languageCode: string): LanguageProvider | undefined {
    return this.loadedChunks.get(languageCode);
  }

  unloadChunk(languageCode: string): void {
    this.loadedChunks.delete(languageCode);
  }

  getLoadedLanguages(): string[] {
    return Array.from(this.loadedChunks.keys());
  }
}

/**
 * Language Context for React components
 */
export interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: LanguageChunk[];
  setLanguage: (language: string) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

/**
 * Language Provider Factory
 * Creates and manages language providers with chunked loading
 */
export class LanguageProviderFactory {
  private static instance: LanguageProviderFactory;
  private registry = LanguageChunkRegistry.getInstance();
  private supportedLanguages: LanguageChunk[] = [];

  static getInstance(): LanguageProviderFactory {
    if (!LanguageProviderFactory.instance) {
      LanguageProviderFactory.instance = new LanguageProviderFactory();
    }
    return LanguageProviderFactory.instance;
  }

  registerLanguage(chunk: LanguageChunk): void {
    this.supportedLanguages.push(chunk);
    // Sort by load priority (lower numbers first)
    this.supportedLanguages.sort((a, b) => (a.loadPriority || 0) - (b.loadPriority || 0));
  }

  getSupportedLanguages(): LanguageChunk[] {
    return [...this.supportedLanguages];
  }

  async getProvider(languageCode: string): Promise<LanguageProvider> {
    return this.registry.loadChunk(languageCode);
  }

  getCachedProvider(languageCode: string): LanguageProvider | undefined {
    return this.registry.getLoadedChunk(languageCode);
  }

  // Preload critical language chunks
  async preloadCriticalChunks(): Promise<void> {
    const criticalLanguages = this.supportedLanguages
      .filter(lang => lang.loadPriority !== undefined && lang.loadPriority <= 1)
      .map(lang => lang.code);

    await Promise.all(criticalLanguages.map(code => this.getProvider(code)));
  }
}