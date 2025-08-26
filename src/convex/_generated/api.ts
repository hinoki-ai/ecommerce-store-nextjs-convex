// Mock Convex API for development and demo deployment
// This file provides mock implementations when SKIP_AUTH=true

// Mock data imports
import { mockProducts, mockCategories, mockUser, mockCart } from '@/lib/mock-data';

// Mock API structure
export const api = {
  products: {
    getAll: async () => mockProducts,
    getById: async (id: string) => mockProducts.find(p => p.id === id),
    getByCategory: async (category: string) => mockProducts.filter(p => p.category === category),
    search: async (query: string) => mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    ),
  },
  categories: {
    getAll: async () => mockCategories,
    getById: async (id: string) => mockCategories.find(c => c.id === id),
  },
  users: {
    getCurrent: async () => mockUser,
    getById: async (id: string) => mockUser.id === id ? mockUser : null,
  },
  carts: {
    getOrCreateCart: async (args: { userId?: string, sessionId?: string }) => {
      console.log('Mock getOrCreateCart called with:', args);
      return {
        _id: 'mock-cart-id',
        userId: args.userId,
        sessionId: args.sessionId,
        items: [] as any[], // Empty cart initially
        pricing: {
          subtotal: { amount: 0, currency: 'USD' },
          tax: { amount: 0, currency: 'USD' },
          total: { amount: 0, currency: 'USD' },
          currency: 'USD'
        },
        audit: {
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      };
    },
    addToCart: async (args: { cartId: string, productId: string, quantity: number, price: number }) => {
      console.log('Mock addToCart called with:', args);
      return { success: true };
    },
    removeFromCart: async (args: { cartId: string, productId: string }) => {
      console.log('Mock removeFromCart called with:', args);
      return { success: true };
    },
    updateCartItemQuantity: async (args: { cartId: string, productId: string, quantity: number }) => {
      console.log('Mock updateCartItemQuantity called with:', args);
      return { success: true };
    },
    clearCart: async (args: { cartId: string }) => {
      console.log('Mock clearCart called with:', args);
      return { success: true };
    },
    getCartWithDetails: async (args: { cartId: string }) => {
      console.log('Mock getCartWithDetails called with:', args);
      return {
        _id: args.cartId,
        userId: 'mock-user-id',
        sessionId: 'mock-session-id',
        items: [
          {
            id: 'mock-cart-item-1',
            productId: 'mock-product-id' as any,
            quantity: 2,
            price: {
              amount: 25.99,
              currency: 'USD'
            },
            addedAt: Date.now(),
            metadata: {
              categoryId: 'mock-category-id',
              tags: ['electronics']
            }
          }
        ],
        pricing: {
          subtotal: { amount: 51.98, currency: 'USD' },
          tax: { amount: 4.16, currency: 'USD' },
          total: { amount: 56.14, currency: 'USD' },
          currency: 'USD'
        },
        audit: {
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      };
    },
  },
  // Keep the old singular cart for backward compatibility
  cart: {
    getCurrent: async () => mockCart,
    addItem: async (productId: string, quantity: number) => {
      // Mock implementation
      return { success: true };
    },
    updateItem: async (itemId: string, quantity: number) => {
      // Mock implementation
      return { success: true };
    },
    removeItem: async (itemId: string) => {
      // Mock implementation
      return { success: true };
    },
    clear: async () => {
      // Mock implementation
      return { success: true };
    },
  },
  orders: {
    create: async (orderData: any) => ({ id: 'mock-order-' + Date.now(), ...orderData }),
    getById: async (id: string) => ({ id, status: 'completed', items: [], total: 0 }),
    getByUser: async (userId: string) => [{ id: 'mock-order-1', status: 'completed', items: [], total: 0 }],
  },
  wishlists: {
    getWishlistCount: async (args: { userId: string }) => {
      console.log('Mock getWishlistCount called with:', args);
      return 3; // Mock count
    },
    getWishlist: async (args: { userId: string }) => {
      console.log('Mock getWishlist called with:', args);
      return mockProducts.slice(0, 3);
    },
    getUserWishlist: async (args: { userId: string }) => {
      console.log('Mock getUserWishlist called with:', args);
      return mockProducts.slice(0, 3);
    },
    getWishlistStats: async (args: { userId: string }) => {
      console.log('Mock getWishlistStats called with:', args);
      return {
        totalItems: 3,
        totalValue: 150,
        averagePrice: 50,
        featuredCount: 1,
        popularCount: 2,
        categories: 2,
        wishlistCount: 1
      };
    },
    addToWishlist: async (args: { userId: string, productId: string }) => {
      console.log('Mock addToWishlist called with:', args);
      return { success: true };
    },
    removeFromWishlist: async (args: { userId: string, productId: string }) => {
      console.log('Mock removeFromWishlist called with:', args);
      return { success: true };
    },
    isInWishlist: async (args: { userId: string, productId: string }) => {
      console.log('Mock isInWishlist called with:', args);
      return false;
    },
    saveForLater: async (args: { userId: string, productId: string }) => {
      console.log('Mock saveForLater called with:', args);
      return { success: true };
    },
    removeFromSaved: async (args: { userId: string, productId: string }) => {
      console.log('Mock removeFromSaved called with:', args);
      return { success: true };
    },
    getSavedForLater: async (args: { userId: string }) => {
      console.log('Mock getSavedForLater called with:', args);
      return mockProducts.slice(0, 2);
    },
  },
  // Keep the old singular wishlist for backward compatibility
  wishlist: {
    getCurrent: async () => ({ items: mockProducts.slice(0, 3) }),
    addItem: async (productId: string) => ({ success: true }),
    removeItem: async (productId: string) => ({ success: true }),
  },
  reviews: {
    getByProduct: async (productId: string) => [
      { id: '1', productId, rating: 5, comment: 'Excelente producto!', userId: mockUser.id, createdAt: new Date() }
    ],
    create: async (review: any) => ({ id: 'mock-review-' + Date.now(), ...review }),
  },
  search: {
    products: async (query: string) => mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ),
  },
};

// Mock mutations (for forms that might try to submit)
export const mutation = (fn: any) => async (...args: any[]) => {
  console.log('Mock mutation called:', fn.name, args);
  return { success: true };
};

// Mock queries
export const query = (fn: any) => async (...args: any[]) => {
  console.log('Mock query called:', fn.name, args);
  return null;
};

// Mock internal functions
export const internalMutation = (fn: any) => async (...args: any[]) => {
  console.log('Mock internal mutation called:', fn.name, args);
  return { success: true };
};

export const internalQuery = (fn: any) => async (...args: any[]) => {
  console.log('Mock internal query called:', fn.name, args);
  return null;
};

// Mock action
export const action = (fn: any) => async (...args: any[]) => {
  console.log('Mock action called:', fn.name, args);
  return { success: true };
};

// Mock ConvexReactClient
export class ConvexReactClient {
  constructor(url: string) {
    console.log('Mock ConvexReactClient initialized with URL:', url);
  }

  onUpdate = () => {};
  offUpdate = () => {};
  close = () => {};
}

// Mock useQuery hook
export const useQuery = (queryFn: any, ...args: any[]) => {
  console.log('Mock useQuery called:', queryFn?.name, args);

  // Handle "skip" parameter - return undefined when query should be skipped
  if (args[0] === "skip") {
    return undefined;
  }

  // If no query function provided, return null
  if (!queryFn) {
    return null;
  }

  // Handle specific query functions
  if (queryFn.name === 'getCartWithDetails' && args[0]?.cartId) {
    return {
      _id: args[0].cartId,
      userId: 'mock-user-id',
      sessionId: 'mock-session-id',
      items: [],
      pricing: {
        subtotal: { amount: 0, currency: 'USD' },
        tax: { amount: 0, currency: 'USD' },
        total: { amount: 0, currency: 'USD' },
        currency: 'USD'
      },
      audit: {
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };
  }

  // Return mock data for other queries
  return null;
};

// Mock useMutation hook
export const useMutation = (mutationFn: any) => {
  return async (...args: any[]) => {
    console.log('Mock useMutation called:', mutationFn?.name, args);
    return { success: true };
  };
};

// Mock useAction hook
export const useAction = (actionFn: any) => {
  return async (...args: any[]) => {
    console.log('Mock useAction called:', actionFn?.name, args);
    return { success: true };
  };
};

// Mock useConvex hook
export const useConvex = () => {
  return new ConvexReactClient('mock://convex.cloud');
};