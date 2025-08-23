/**
 * English Language Chunk
 * Default chunked language implementation for English (en)
 */

import { BaseLanguageProvider } from '../providers/language-provider';

export class EnglishLanguageProvider extends BaseLanguageProvider {
  constructor() {
    super(
      'en',
      {
        siteName: 'Luxury E-Commerce Store',
        description: 'Premium luxury products with AI-optimized SEO',
        keywords: ['luxury', 'premium', 'quality', 'designer', 'fashion', 'accessories'],
        metaTags: {
          'og:type': 'website',
          'og:site_name': 'Luxury E-Commerce Store',
          'twitter:card': 'summary_large_image',
          'twitter:title': 'Luxury E-Commerce Store',
          'twitter:description': 'Premium luxury products with AI-optimized SEO',
        }
      },
      {
        // Navigation
        nav: {
          home: 'Home',
          products: 'Products',
          categories: 'Categories',
          collections: 'Collections',
          blog: 'Blog',
          about: 'About',
          contact: 'Contact',
          cart: 'Cart',
          wishlist: 'Wishlist',
          account: 'My Account',
          search: 'Search',
          signIn: 'Sign In',
          signUp: 'Sign Up'
        },

        // Common UI elements
        common: {
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          warning: 'Warning',
          info: 'Information',
          cancel: 'Cancel',
          confirm: 'Confirm',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          add: 'Add',
          remove: 'Remove',
          back: 'Back',
          next: 'Next',
          previous: 'Previous',
          close: 'Close',
          open: 'Open'
        },

        // Product related
        product: {
          price: 'Price',
          originalPrice: 'Original Price',
          discount: 'Discount',
          inStock: 'In Stock',
          outOfStock: 'Out of Stock',
          addToCart: 'Add to Cart',
          buyNow: 'Buy Now',
          description: 'Description',
          specifications: 'Specifications',
          reviews: 'Reviews',
          relatedProducts: 'Related Products',
          quantity: 'Quantity',
          size: 'Size',
          color: 'Color',
          material: 'Material',
          brand: 'Brand',
          sku: 'SKU',
          availability: 'Availability',
          notFound: 'Product Not Found',
          notFoundDesc: 'The product you\'re looking for doesn\'t exist or has been removed.',
          browseProducts: 'Browse Products'
        },

        // Cart and checkout
        cart: {
          title: 'Shopping Cart',
          empty: 'Your cart is empty',
          subtotal: 'Subtotal',
          tax: 'Tax',
          shipping: 'Shipping',
          total: 'Total',
          checkout: 'Checkout',
          continueShopping: 'Continue Shopping',
          removeItem: 'Remove Item',
          updateQuantity: 'Update Quantity'
        },

        // User account
        account: {
          profile: 'Profile',
          orders: 'Orders',
          addresses: 'Addresses',
          paymentMethods: 'Payment Methods',
          settings: 'Settings',
          logout: 'Logout',
          login: 'Login',
          register: 'Register',
          forgotPassword: 'Forgot Password?',
          email: 'Email',
          password: 'Password',
          firstName: 'First Name',
          lastName: 'Last Name',
          phone: 'Phone'
        },

        // SEO and content
        seo: {
          luxury: 'luxury',
          premium: 'premium',
          quality: 'quality',
          designer: 'designer',
          fashion: 'fashion',
          accessories: 'accessories',
          beauty: 'beauty',
          home: 'home',
          electronics: 'electronics'
        },

        // Hero and main content
        hero: {
          title: 'Welcome to Luxury E-Commerce Store',
          subtitle: 'Premium luxury products with AI-optimized SEO',
          newBadge: '✨ New AI-Powered Shopping Experience',
          shopNow: 'Shop Now',
          featuredProducts: 'Featured Products',
          exploreCategories: 'Explore Categories'
        },

        // Categories
        categories: {
          electronics: 'Electronics',
          clothing: 'Clothing',
          homeGarden: 'Home & Garden',
          sports: 'Sports',
          beauty: 'Beauty',
          books: 'Books',
          toys: 'Toys',
          automotive: 'Automotive'
        },

        // Features/Benefits
        features: {
          freeShipping: 'Free Shipping',
          freeShippingDesc: 'Free delivery on orders over $100',
          securePayment: 'Secure Payment',
          securePaymentDesc: 'Your payment information is safe with us',
          easyReturns: 'Easy Returns',
          easyReturnsDesc: '30-day return policy for all items',
          customerSupport: '24/7 Support',
          customerSupportDesc: 'Get help whenever you need it'
        },

        // Collections and sections
        collections: 'Collections',
        blog: 'Blog',
        about: 'About',
        contact: 'Contact',

        // Product details
        productDetails: 'Product Details',
        specifications: 'Specifications',
        reviews: 'Reviews',
        relatedProducts: 'Related Products',
        customerReviews: 'Customer Reviews',
        writeReview: 'Write a Review',
        addToWishlist: 'Add to Wishlist',
        removeFromWishlist: 'Remove from Wishlist',

        // Cart and checkout
        checkout: 'Checkout',
        continueShopping: 'Continue Shopping',
        orderSummary: 'Order Summary',
        subtotal: 'Subtotal',
        tax: 'Tax',
        shipping: 'Shipping',
        total: 'Total',
        applyCoupon: 'Apply Coupon',
        couponCode: 'Coupon Code',
        haveAccount: 'Have an account?',
        signIn: 'Sign in',
        guestCheckout: 'Guest Checkout',
        billingAddress: 'Billing Address',
        shippingAddress: 'Shipping Address',
        paymentMethod: 'Payment Method',
        placeOrder: 'Place Order',
        orderConfirmation: 'Order Confirmation',
        thankYou: 'Thank you for your order!',
        orderNumber: 'Order Number',

        // Footer
        footer: {
          company: 'Company',
          customerService: 'Customer Service',
          followUs: 'Follow Us',
          newsletter: 'Newsletter',
          subscribe: 'Subscribe',
          emailPlaceholder: 'Enter your email',
          allRightsReserved: 'All rights reserved',
          privacyPolicy: 'Privacy Policy',
          termsOfService: 'Terms of Service',
          shippingInfo: 'Shipping Info',
          returnPolicy: 'Return Policy',
          faq: 'FAQ'
        },

        // Additional form elements
        forms: {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          phone: 'Phone',
          address: 'Address',
          city: 'City',
          state: 'State',
          zipCode: 'ZIP Code',
          country: 'Country',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          createAccount: 'Create Account',
          rememberMe: 'Remember me',
          forgotPassword: 'Forgot Password?',
          resetPassword: 'Reset Password',
          login: 'Login',
          register: 'Register',
          newsletterSignup: 'Sign up for our newsletter',
          agreeTerms: 'I agree to the Terms of Service',
          subscribe: 'Subscribe'
        },

        // Additional error and success messages
        errors: {
          requiredField: 'This field is required',
          invalidEmail: 'Please enter a valid email address',
          passwordTooShort: 'Password must be at least 8 characters',
          passwordsNotMatch: 'Passwords do not match',
          invalidPhone: 'Please enter a valid phone number',
          invalidZipCode: 'Please enter a valid ZIP code',
          couponInvalid: 'Invalid coupon code',
          outOfStock: 'This item is out of stock',
          minimumOrder: 'Minimum order amount is $10',
          paymentFailed: 'Payment failed. Please try again',
          shippingAddressRequired: 'Shipping address is required',
          billingAddressRequired: 'Billing address is required',
          invalidCardNumber: 'Please enter a valid card number',
          invalidExpiryDate: 'Please enter a valid expiry date',
          invalidCvv: 'Please enter a valid CVV',
          insufficientStock: 'Insufficient stock for some items',
          maximumQuantity: 'Maximum quantity exceeded',
          duplicateEmail: 'This email is already registered',
          accountNotFound: 'Account not found',
          invalidCredentials: 'Invalid email or password',
          accountLocked: 'Account is temporarily locked',
          sessionExpired: 'Your session has expired. Please log in again',
          networkError: 'Network error. Please check your connection',
          serverError: 'Server error. Please try again later',
          orderNotFound: 'Order not found',
          paymentDeclined: 'Payment was declined',
          addressNotFound: 'Address not found',
          productNotFound: 'Product not found',
          categoryNotFound: 'Category not found',
          insufficientPermissions: 'Insufficient permissions',
          rateLimitExceeded: 'Too many requests. Please try again later'
        },

        success: {
          couponApplied: 'Coupon applied successfully',
          accountCreated: 'Account created successfully',
          passwordReset: 'Password reset email sent',
          reviewSubmitted: 'Review submitted successfully',
          newsletterSubscribed: 'Successfully subscribed to newsletter',
          orderPlaced: 'Order placed successfully',
          paymentProcessed: 'Payment processed successfully',
          addressSaved: 'Address saved successfully',
          profileUpdated: 'Profile updated successfully',
          passwordChanged: 'Password changed successfully',
          wishlistUpdated: 'Wishlist updated successfully',
          itemAddedToCart: 'Item added to cart successfully',
          itemRemovedFromCart: 'Item removed from cart successfully',
          subscriptionUpdated: 'Subscription updated successfully',
          notificationSettingsUpdated: 'Notification settings updated successfully',
          languageChanged: 'Language changed successfully',
          currencyChanged: 'Currency changed successfully',
          loginSuccessful: 'Login successful',
          logoutSuccessful: 'Logout successful',
          registrationSuccessful: 'Registration successful',
          emailVerified: 'Email verified successfully',
          orderCancelled: 'Order cancelled successfully',
          refundProcessed: 'Refund processed successfully'
        },

        // Currency and pricing
        currency: {
          symbol: '$',
          code: 'CLP',
          format: 'es-CL'
        },

        // Regional variations for Chile/Latin America
        regional: {
          chile: {
            currencySymbol: 'CLP $',
            currencyFormat: 'es-CL',
            countryName: 'Chile',
            regionName: 'Latin America',
            postalCodeName: 'Postal Code',
            stateName: 'Region',
            phoneCode: '+56',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h'
          },
          // Common Latin American terms
          commonTerms: {
            neighborhood: 'Neighborhood/Commune',
            municipality: 'Municipality/Commune',
            province: 'Province/Region',
            department: 'Department',
            district: 'District'
          }
        },

        // Payment methods common in Latin America
        paymentMethods: {
          creditCard: 'Credit Card',
          debitCard: 'Debit Card',
          bankTransfer: 'Bank Transfer',
          cashOnDelivery: 'Cash on Delivery',
          digitalWallet: 'Digital Wallet',
          installments: 'Installments',
          onePayment: 'One Payment',
          twoPayments: '2 Installments',
          threePayments: '3 Installments',
          sixPayments: '6 Installments',
          twelvePayments: '12 Installments'
        },

        // Chilean specific terms
        chileanTerms: {
          rut: 'RUT',
          rutPlaceholder: '12.345.678-9',
          boleta: 'Receipt',
          factura: 'Invoice',
          despacho: 'Delivery',
          retiro: 'Store Pickup',
          sucursal: 'Branch',
          puntoDeRetiro: 'Pickup Point'
        },

        // Date and time
        date: {
          today: 'Today',
          yesterday: 'Yesterday',
          tomorrow: 'Tomorrow',
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },

        // Footer specific
        footer: {
          quickLinks: 'Quick Links',
          customerService: 'Customer Service',
          contactInfo: 'Contact Info',
          helpCenter: 'Help Center',
          shippingInfo: 'Shipping Info',
          returnsExchanges: 'Returns & Exchanges',
          sizeGuide: 'Size Guide',
          privacyPolicy: 'Privacy Policy',
          termsOfService: 'Terms of Service',
          cookiePolicy: 'Cookie Policy',
          allRightsReserved: 'All rights reserved.',
          address: '123 Commerce St, City, Country',
          phone: '+1 (555) 123-4567',
          email: 'support@aramacbranfing.com'
        },

        // Product specific
        productCard: {
          new: 'New',
          fresh: 'Fresh',
          popular: 'Popular',
          noImage: 'No Image',
          adding: 'Adding...',
          viewDetails: 'View Details',
          seoScore: 'SEO Score'
        },

        // Product detail page
        productDetail: {
          seoOptimizationScore: 'SEO Optimization Score',
          seoOptimizationDesc: 'AI-powered optimization for better visibility',
          excellent: 'Excellent',
          good: 'Good',
          needsImprovement: 'Needs Improvement',
          description: 'Description',
          specifications: 'Specifications',
          reviews: 'Reviews',
          technicalSpecifications: 'Technical Specifications',
          dimensions: 'Dimensions',
          weight: 'Weight',
          material: 'Material',
          additionalFeatures: 'Additional Features',
          premiumQualityMaterials: 'Premium quality materials',
          manufacturerWarranty: 'Manufacturer warranty',
          freeShipping: 'Free shipping',
          premiumQuality: 'Premium Quality'
        },

        // Admin functionality
        admin: {
          dashboard: 'Dashboard',
          analytics: 'Analytics',
          orders: 'Orders',
          customers: 'Customers',
          products: 'Products',
          settings: 'Settings',
          content: 'Content',
          seo: 'SEO',
          users: 'Users',
          revenue: 'Revenue',
          inventory: 'Inventory',
          reports: 'Reports',
          notifications: 'Notifications',
          promotions: 'Promotions',
          affiliates: 'Affiliates',
          advanced: 'Advanced',
          orderManagement: 'Order Management',
          searchOrders: 'Search orders',
          filterByStatus: 'Filter by status',
          orderNumber: 'Order #',
          customerName: 'Customer Name',
          orderDate: 'Order Date',
          orderStatus: 'Order Status',
          orderTotal: 'Order Total',
          viewOrder: 'View Order',
          editOrder: 'Edit Order',
          shipOrder: 'Ship Order',
          cancelOrder: 'Cancel Order',
          processRefund: 'Process Refund',
          customerService: 'Customer Service',
          supportTickets: 'Support Tickets',
          reviews: 'Reviews',
          analyticsOverview: 'Analytics Overview',
          salesPerformance: 'Sales Performance',
          customerInsights: 'Customer Insights',
          productPerformance: 'Product Performance',
          seoAnalytics: 'SEO Analytics',
          trafficSources: 'Traffic Sources',
          conversionRate: 'Conversion Rate',
          averageOrderValue: 'Average Order Value',
          customerRetention: 'Customer Retention',
          inventoryManagement: 'Inventory Management',
          stockLevels: 'Stock Levels',
          lowStockAlerts: 'Low Stock Alerts',
          outOfStockItems: 'Out of Stock Items',
          reorderPoints: 'Reorder Points',
          supplierManagement: 'Supplier Management',
          bulkOperations: 'Bulk Operations',
          importExport: 'Import/Export',
          systemSettings: 'System Settings',
          paymentSettings: 'Payment Settings',
          shippingSettings: 'Shipping Settings',
          taxSettings: 'Tax Settings',
          emailSettings: 'Email Settings',
          apiSettings: 'API Settings',
          securitySettings: 'Security Settings',
          backupRestore: 'Backup & Restore',
          systemMaintenance: 'System Maintenance'
        },

        // Order statuses
        orderStatus: {
          pending: 'Pending',
          processing: 'Processing',
          confirmed: 'Confirmed',
          shipped: 'Shipped',
          delivered: 'Delivered',
          cancelled: 'Cancelled',
          refunded: 'Refunded',
          onHold: 'On Hold',
          backordered: 'Backordered',
          returned: 'Returned',
          failed: 'Failed'
        },

        // Tracking and shipping
        tracking: {
          trackingNumber: 'Tracking Number',
          carrier: 'Carrier',
          estimatedDelivery: 'Estimated Delivery',
          shippingMethod: 'Shipping Method',
          trackingHistory: 'Tracking History',
          shipped: 'Shipped',
          inTransit: 'In Transit',
          outForDelivery: 'Out for Delivery',
          delivered: 'Delivered',
          deliveryAttempted: 'Delivery Attempted',
          awaitingPickup: 'Awaiting Pickup',
          returnedToSender: 'Returned to Sender'
        },

        // Refund and cancellation
        refund: {
          refundRequest: 'Refund Request',
          refundStatus: 'Refund Status',
          refundAmount: 'Refund Amount',
          refundReason: 'Refund Reason',
          processingRefund: 'Processing Refund',
          refundCompleted: 'Refund Completed',
          refundDenied: 'Refund Denied',
          partialRefund: 'Partial Refund',
          fullRefund: 'Full Refund',
          cancelOrder: 'Cancel Order',
          cancellationReason: 'Cancellation Reason',
          orderCancelled: 'Order Cancelled',
          cancellationPolicy: 'Cancellation Policy'
        },

        // Home page specific
        home: {
          heroBadge: '✨ New AI-Powered Shopping Experience',
          heroTitle: 'Discover Premium Products',
          heroSubtitle: 'Shop with confidence using our AI-powered recommendations and personalized shopping experience',
          shopNow: 'Shop Now',
          viewAll: 'View All',
          freeShipping: 'Free Shipping',
          freeShippingDesc: 'Free delivery on orders over $50',
          securePayment: 'Secure Payment',
          securePaymentDesc: '256-bit SSL encryption',
          easyReturns: 'Easy Returns',
          easyReturnsDesc: '30-day return policy',
          categoriesTitle: 'Shop by Category',
          categoriesSubtitle: 'Explore our wide range of premium products',
          featuredProducts: 'Featured Products',
          featuredProductsDesc: 'Discover our handpicked selection of premium products',
          aiRecommendations: 'AI-Personalized Recommendations',
          aiRecommendationsDesc: 'Get personalized product recommendations based on your preferences',
          aiOptimizationTitle: 'AI-Powered Optimization',
          aiOptimizationDesc: 'Our AI continuously optimizes product listings, generates SEO-friendly content, and ensures maximum visibility across search engines',
          averageSeoScore: 'Average SEO Score',
          seoScoreDesc: 'AI-optimized product descriptions and meta tags for better search rankings',
          aiGeneratedCollections: 'AI-Generated Collections',
          aiCollectionsDesc: 'Smart product groupings based on customer behavior and trends',
          seoMonitoring: 'SEO Monitoring',
          seoMonitoringDesc: 'Continuous performance tracking and optimization suggestions',
          ctaTitle: 'Ready to Experience Smart Shopping?',
          ctaSubtitle: 'Join thousands of satisfied customers who trust our AI-powered platform for their shopping needs.',
          startShopping: 'Start Shopping',
          learnMore: 'Learn More'
        }
      }
    );
  }
}

// Export singleton instance
const englishProvider = new EnglishLanguageProvider();
export default englishProvider;