// Mock data service for testing without Convex/Clerk
// This file provides mock data when SKIP_AUTH=true

export const mockProducts = [
  {
    id: "1",
    name: "Smartphone Premium",
    description: "Un teléfono inteligente de última generación con características avanzadas perfectas para el mercado rural chileno.",
    price: 299999,
    currency: "CLP",
    image: "/images/products/smartphone.jpg",
    category: "Electronics",
    inStock: true,
    stock: 50,
    tags: ["smartphone", "electronics", "premium", "chile"],
    rating: 4.5,
    reviews: 128
  },
  {
    id: "2", 
    name: "Laptop Productividad",
    description: "Laptop ideal para trabajo remoto y estudios, optimizada para conectividad rural.",
    price: 549999,
    currency: "CLP",
    image: "/images/products/laptop.jpg",
    category: "Computers",
    inStock: true,
    stock: 25,
    tags: ["laptop", "productivity", "work", "students"],
    rating: 4.7,
    reviews: 89
  },
  {
    id: "3",
    name: "Cafetera Artesanal",
    description: "Cafetera perfecta para disfrutar del mejor café chileno en casa.",
    price: 89999,
    currency: "CLP",
    image: "/images/products/coffee-maker.jpg", 
    category: "Home & Garden",
    inStock: true,
    stock: 75,
    tags: ["coffee", "kitchen", "home", "artisanal"],
    rating: 4.3,
    reviews: 156
  },
  {
    id: "4",
    name: "Auriculares Inalámbricos",
    description: "Auriculares de alta calidad con cancelación de ruido.",
    price: 129999,
    currency: "CLP", 
    image: "/images/products/headphones.jpg",
    category: "Electronics",
    inStock: true,
    stock: 100,
    tags: ["headphones", "audio", "wireless", "music"],
    rating: 4.6,
    reviews: 203
  }
];

export const mockCategories = [
  {
    id: "electronics",
    name: "Electrónicos",
    slug: "electronics",
    description: "Tecnología y electrónicos para el hogar",
    image: "/images/categories/electronics.jpg",
    productCount: 45
  },
  {
    id: "computers", 
    name: "Computadoras",
    slug: "computers",
    description: "Laptops, PCs y accesorios informáticos",
    image: "/images/categories/computers.jpg",
    productCount: 23
  },
  {
    id: "home-garden",
    name: "Hogar y Jardín", 
    slug: "home-garden",
    description: "Productos para el hogar y jardín",
    image: "/images/categories/home-garden.jpg",
    productCount: 67
  }
];

export const mockUser = {
  id: process.env.NEXT_PUBLIC_MOCK_USER_ID || "test-user-123",
  email: process.env.NEXT_PUBLIC_MOCK_USER_EMAIL || "test@aramac.dev",
  firstName: "Usuario",
  lastName: "Prueba",
  fullName: "Usuario Prueba",
  imageUrl: "/images/avatar-placeholder.jpg"
};

export const mockCart = {
  id: "mock-cart-123",
  userId: mockUser.id,
  items: [
    {
      id: "cart-item-1",
      productId: "1",
      quantity: 1,
      product: mockProducts[0]
    },
    {
      id: "cart-item-2", 
      productId: "3",
      quantity: 2,
      product: mockProducts[2]
    }
  ],
  total: mockProducts[0].price + (mockProducts[2].price * 2),
  itemCount: 3
};

export const mockOrders = [
  {
    id: "order-123",
    userId: mockUser.id,
    status: "completed",
    total: 389999,
    currency: "CLP",
    items: [
      {
        productId: "1",
        quantity: 1,
        price: 299999,
        product: mockProducts[0]
      }
    ],
    shippingAddress: {
      street: "Calle Principal 123",
      city: "Temuco",
      region: "Araucanía", 
      zipCode: "4780000",
      country: "Chile"
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  }
];

// Mock API functions
export const mockApi = {
  // Products
  getProducts: async () => mockProducts,
  getProduct: async (id: string) => mockProducts.find(p => p.id === id),
  
  // Categories  
  getCategories: async () => mockCategories,
  getCategory: async (slug: string) => mockCategories.find(c => c.slug === slug),
  
  // User
  getCurrentUser: async () => mockUser,
  
  // Cart
  getCart: async () => mockCart,
  addToCart: async (productId: string, quantity: number) => {
    console.log(`Mock: Added ${quantity}x product ${productId} to cart`);
    return { success: true };
  },
  removeFromCart: async (itemId: string) => {
    console.log(`Mock: Removed item ${itemId} from cart`);
    return { success: true };
  },
  
  // Orders
  getOrders: async () => mockOrders,
  createOrder: async (orderData: any) => {
    console.log("Mock: Created order", orderData);
    return { id: "new-order-" + Date.now(), success: true };
  }
};

export const isMockMode = () => {
  return process.env.SKIP_AUTH === "true" || process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
};