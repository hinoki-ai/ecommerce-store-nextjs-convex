import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProductData {
  id?: string;
  title: string;
  description: string;
  category?: string;
  price?: number;
  tags?: string;
}

export interface OptimizedProduct {
  optimizedTitle: string;
  optimizedDescription: string;
  tags: string[];
  seoScore: number;
  reasoning: string;
}

export interface CollectionSuggestion {
  name: string;
  description: string;
  tags: string[];
  isHoliday: boolean;
  holidayDate?: Date;
}

/**
 * AI-powered product optimization following the tutorial's methodology
 */
export class AISEOService {
  /**
   * Optimize product title and description to eliminate duplicates and improve SEO
   */
  static async optimizeProduct(product: ProductData): Promise<OptimizedProduct> {
    const prompt = `
You are an expert e-commerce SEO specialist. Optimize this product for maximum SEO performance.

Product Details:
- Title: "${product.title}"
- Description: "${product.description}"
- Category: "${product.category || 'General'}"
- Price: ${product.price ? `$${product.price}` : 'N/A'}

Requirements:
1. Create a UNIQUE, SEO-optimized title that avoids duplicates
2. Write a compelling, SEO-friendly description (200-300 words)
3. Generate 15-20 relevant tags for collection creation
4. Ensure content is in proper English (US)
5. Calculate an SEO score (0-100)

Format your response as JSON:
{
  "optimizedTitle": "string",
  "optimizedDescription": "string",
  "tags": ["array", "of", "tags"],
  "seoScore": number,
  "reasoning": "brief explanation of changes"
}

Focus on:
- Unique selling propositions
- Long-tail keywords
- Search intent alignment
- Natural language patterns
- E-commerce conversion optimization
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional e-commerce SEO optimizer. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from OpenAI');

      const result = JSON.parse(response) as OptimizedProduct;
      return result;
    } catch (error) {
      console.error('AI optimization error:', error);
      throw new Error('Failed to optimize product');
    }
  }

  /**
   * Generate AI-powered alt text for product images
   */
  static async generateAltText(imageUrl: string, productTitle: string, tags: string[]): Promise<string> {
    const prompt = `
Generate SEO-optimized alt text for this product image.

Product: "${productTitle}"
Tags: ${tags.join(', ')}

Requirements:
- Describe the image content accurately
- Include relevant keywords naturally
- Keep under 125 characters
- Focus on accessibility and SEO
- Avoid keyword stuffing

Example good alt text: "Premium black leather motorcycle jacket with silver zippers and reinforced stitching"
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Generate concise, SEO-friendly alt text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 50
      });

      return completion.choices[0]?.message?.content?.trim() || productTitle;
    } catch (error) {
      console.error('Alt text generation error:', error);
      return productTitle;
    }
  }

  /**
   * Generate collection suggestions based on product tags (shotgun approach)
   */
  static async generateCollections(products: ProductData[]): Promise<CollectionSuggestion[]> {
    const allTags = products.flatMap(p => p.tags?.split(',') || []).filter(Boolean);
    const uniqueTags = [...new Set(allTags)];

    const prompt = `
Based on these product tags, generate collection suggestions for an e-commerce store.

Tags: ${uniqueTags.join(', ')}

Requirements:
1. Create 10-15 collection suggestions
2. Each collection should target specific customer segments
3. Include seasonal/holiday collections (Black Friday, Christmas, etc.)
4. Focus on long-tail keywords and specific use cases
5. Make collections highly specific for better SEO targeting

Format as JSON array:
[
  {
    "name": "Collection Name",
    "description": "SEO-optimized description",
    "tags": ["related", "tags"],
    "isHoliday": false,
    "holidayDate": null
  }
]

Examples:
- "Luxury Italian Leather Motorcyclist Gear"
- "Black Friday Premium Overcoats"
- "Wedding Guest Elegant Blazers"
- "Winter Essential Four-Season Pieces"
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Generate strategic e-commerce collections for SEO optimization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from OpenAI');

      const collections = JSON.parse(response) as CollectionSuggestion[];
      return collections;
    } catch (error) {
      console.error('Collection generation error:', error);
      return [];
    }
  }

  /**
   * Generate blog content with internal links (as per tutorial)
   */
  static async generateBlogContent(topic: string, products: ProductData[]): Promise<{
    title: string;
    content: string;
    internalLinks: Array<{productId: string; anchorText: string;}>
  }> {
    const productList = products.map(p => `${p.title} (${p.tags})`).join('\n');

    const prompt = `
Write a comprehensive blog post about "${topic}" for an e-commerce store.

Available Products:
${productList}

Requirements:
1. Create an engaging, SEO-optimized title
2. Write 800-1200 words of high-quality content
3. Naturally include internal links to products using descriptive anchor text
4. Focus on user intent and provide value
5. Include product images and descriptions
6. Optimize for featured snippets and rich results

Format as JSON:
{
  "title": "SEO-Optimized Blog Title",
  "content": "Full blog content with <h2>, <p>, <img> tags",
  "internalLinks": [
    {
      "productId": "product-id",
      "anchorText": "descriptive anchor text"
    }
  ]
}

Content should:
- Answer common customer questions
- Compare products naturally
- Include buying guides
- Use conversational tone
- Optimize for long-tail keywords
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Write SEO-optimized blog content with internal linking strategy."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from OpenAI');

      const result = JSON.parse(response);
      return result;
    } catch (error) {
      console.error('Blog generation error:', error);
      throw new Error('Failed to generate blog content');
    }
  }
}