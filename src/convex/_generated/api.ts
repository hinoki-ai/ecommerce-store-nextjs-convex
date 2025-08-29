/* eslint-disable */
// Mock Convex API for development - Authentication focused
// This provides mock implementations that work for authentication testing

// Mock data imports
import { mockProducts, mockCategories, mockUser, mockCart } from '@/lib/mock-data';

// Mock API structure - simplified for authentication
export const api = {
  carts: {
    getCartWithDetails: async (args: { cartId: string }) => {
      console.log('Mock getCartWithDetails called with:', args);
      return mockCart;
    },
    getOrCreateCart: async (args: any) => {
      console.log('Mock getOrCreateCart called with:', args);
      return mockCart;
    },
    addToCart: async (args: any) => {
      console.log('Mock addToCart called with:', args);
      return { success: true };
    },
    removeFromCart: async (args: any) => {
      console.log('Mock removeFromCart called with:', args);
      return { success: true };
    },
    updateCartItemQuantity: async (args: any) => {
      console.log('Mock updateCartItemQuantity called with:', args);
      return { success: true };
    },
    clearCart: async (args: any) => {
      console.log('Mock clearCart called with:', args);
      return { success: true };
    },
  },
  users: {
    getCurrentUser: async () => {
      console.log('Mock getCurrentUser called');
      return mockUser;
    },
    getAllUsers: async () => {
      console.log('Mock getAllUsers called');
      return [mockUser];
    },
    getOrCreateUser: async (args: any) => {
      console.log('Mock getOrCreateUser called with:', args);
      return mockUser;
    },
    updateUser: async (args: any) => {
      console.log('Mock updateUser called with:', args);
      return mockUser;
    },
    updateUserRole: async (args: any) => {
      console.log('Mock updateUserRole called with:', args);
      return mockUser;
    },
    isUserAdmin: async () => {
      console.log('Mock isUserAdmin called');
      return false;
    },
    createAdminUser: async (args: any) => {
      console.log('Mock createAdminUser called with:', args);
      return mockUser;
    },
    upsertFromClerk: async (args: any) => {
      console.log('Mock upsertFromClerk called with:', args);
      return mockUser;
    },
    deleteFromClerk: async (args: any) => {
      console.log('Mock deleteFromClerk called with:', args);
      return null;
    },
  },
  products: {
    getAll: async () => {
      console.log('Mock products.getAll called');
      return mockProducts;
    },
    getById: async (id: string) => {
      console.log('Mock products.getById called with:', id);
      return mockProducts.find(p => p.id === id);
    },
    getByCategory: async (category: string) => {
      console.log('Mock products.getByCategory called with:', category);
      return mockProducts.filter(p => p.category === category);
    },
    search: async (query: string) => {
      console.log('Mock products.search called with:', query);
      return mockProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    },
    getFeaturedProducts: async () => {
      console.log('Mock products.getFeaturedProducts called');
      return mockProducts.slice(0, 3);
    },
    getPopularProducts: async () => {
      console.log('Mock products.getPopularProducts called');
      return mockProducts.slice(0, 3);
    },
  },
  categories: {
    getAll: async () => {
      console.log('Mock categories.getAll called');
      return mockCategories;
    },
    getById: async (id: string) => {
      console.log('Mock categories.getById called with:', id);
      return mockCategories.find(c => c.id === id);
    },
  },
  // Legacy compatibility
  cart: {
    getCurrent: async () => {
      console.log('Mock cart.getCurrent called');
      return mockCart;
    },
    addItem: async (args: any) => {
      console.log('Mock cart.addItem called with:', args);
      return { success: true };
    },
  },
};

// Export individual modules for direct access if needed
export const carts = api.carts;
export const users = api.users;
export const products = api.products;
export const categories = api.categories;
export const cart = api.cart;