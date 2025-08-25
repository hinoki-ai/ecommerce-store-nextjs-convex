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