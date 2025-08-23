/**
 * Spanish Language Chunk
 * Primary chunked language implementation for Spanish (es)
 */

import { BaseLanguageProvider } from '../providers/language-provider';

export class SpanishLanguageProvider extends BaseLanguageProvider {
  constructor() {
    const translations = {
        // Navigation
        nav: {
          home: 'Inicio',
          products: 'Productos',
          categories: 'Categorías',
          collections: 'Colecciones',
          blog: 'Blog',
          about: 'Acerca de',
          contact: 'Contacto',
          cart: 'Carrito',
          wishlist: 'Lista de Deseos',
          account: 'Mi Cuenta',
          search: 'Buscar',
          signIn: 'Iniciar Sesión',
          signUp: 'Registrarse'
        },

        // Common UI elements
        common: {
          loading: 'Cargando...',
          error: 'Error',
          success: 'Éxito',
          warning: 'Advertencia',
          info: 'Información',
          cancel: 'Cancelar',
          confirm: 'Confirmar',
          save: 'Guardar',
          delete: 'Eliminar',
          edit: 'Editar',
          add: 'Agregar',
          remove: 'Remover',
          back: 'Volver',
          next: 'Siguiente',
          previous: 'Anterior',
          close: 'Cerrar',
          open: 'Abrir'
        },

        // Product related
        product: {
          price: 'Precio',
          originalPrice: 'Precio Original',
          discount: 'Descuento',
          inStock: 'En Stock',
          outOfStock: 'Agotado',
          addToCart: 'Agregar al Carrito',
          buyNow: 'Comprar Ahora',
          description: 'Descripción',
          specifications: 'Especificaciones',
          reviews: 'Reseñas',
          relatedProducts: 'Productos Relacionados',
          quantity: 'Cantidad',
          size: 'Talla',
          color: 'Color',
          material: 'Material',
          brand: 'Marca',
          sku: 'SKU',
          availability: 'Disponibilidad',
          notFound: 'Producto No Encontrado',
          notFoundDesc: 'El producto que buscas no existe o ha sido removido.',
          browseProducts: 'Explorar Productos'
        },

        // Cart and checkout
        cart: {
          title: 'Carrito de Compras',
          empty: 'Tu carrito está vacío',
          subtotal: 'Subtotal',
          tax: 'Impuestos',
          shipping: 'Envío',
          total: 'Total',
          checkout: 'Finalizar Compra',
          continueShopping: 'Continuar Comprando',
          removeItem: 'Remover Artículo',
          updateQuantity: 'Actualizar Cantidad'
        },

        // User account
        account: {
          profile: 'Perfil',
          orders: 'Pedidos',
          addresses: 'Direcciones',
          paymentMethods: 'Métodos de Pago',
          settings: 'Configuración',
          logout: 'Cerrar Sesión',
          login: 'Iniciar Sesión',
          register: 'Registrarse',
          forgotPassword: '¿Olvidaste tu contraseña?',
          email: 'Correo Electrónico',
          password: 'Contraseña',
          firstName: 'Nombre',
          lastName: 'Apellido',
          phone: 'Teléfono'
        },

        // SEO and content
        seo: {
          luxury: 'lujo',
          premium: 'premium',
          quality: 'calidad',
          designer: 'diseñador',
          fashion: 'moda',
          accessories: 'accesorios',
          beauty: 'belleza',
          home: 'hogar',
          electronics: 'electrónicos'
        },

        // Hero and main content
        hero: {
          title: 'Bienvenido a Tienda de Lujo en Línea',
          subtitle: 'Productos de lujo premium con SEO optimizado por IA',
          newBadge: '✨ Nueva Experiencia de Compras con IA',
          shopNow: 'Comprar Ahora',
          featuredProducts: 'Productos Destacados',
          exploreCategories: 'Explorar Categorías'
        },

        // Categories
        categories: {
          electronics: 'Electrónicos',
          clothing: 'Ropa',
          homeGarden: 'Hogar y Jardín',
          sports: 'Deportes',
          beauty: 'Belleza',
          books: 'Libros',
          toys: 'Juguetes',
          automotive: 'Automotriz'
        },

        // Features/Benefits
        features: {
          freeShipping: 'Envío Gratis',
          freeShippingDesc: 'Entrega gratuita en pedidos mayores a $100',
          securePayment: 'Pago Seguro',
          securePaymentDesc: 'Tu información de pago está segura con nosotros',
          easyReturns: 'Devoluciones Fáciles',
          easyReturnsDesc: 'Política de devolución de 30 días para todos los artículos',
          customerSupport: 'Soporte 24/7',
          customerSupportDesc: 'Obtén ayuda cuando la necesites'
        },

        // Collections and sections
        collections: 'Colecciones',
        blog: 'Blog',
        about: 'Acerca de',
        contact: 'Contacto',

        // Product details
        productDetails: 'Detalles del Producto',
        specifications: 'Especificaciones',
        reviews: 'Reseñas',
        relatedProducts: 'Productos Relacionados',
        customerReviews: 'Reseñas de Clientes',
        writeReview: 'Escribir una Reseña',
        addToWishlist: 'Agregar a Lista de Deseos',
        removeFromWishlist: 'Remover de Lista de Deseos',

        // Cart and checkout
        checkout: 'Finalizar Compra',
        continueShopping: 'Continuar Comprando',
        orderSummary: 'Resumen del Pedido',
        subtotal: 'Subtotal',
        tax: 'Impuestos',
        shipping: 'Envío',
        total: 'Total',
        applyCoupon: 'Aplicar Cupón',
        couponCode: 'Código de Cupón',
        haveAccount: '¿Tienes una cuenta?',
        signIn: 'Iniciar Sesión',
        guestCheckout: 'Compra como Invitado',
        billingAddress: 'Dirección de Facturación',
        shippingAddress: 'Dirección de Envío',
        paymentMethod: 'Método de Pago',
        placeOrder: 'Realizar Pedido',
        orderConfirmation: 'Confirmación del Pedido',
        thankYou: '¡Gracias por tu pedido!',
        orderNumber: 'Número de Pedido',

        // Footer
        footer: {
          company: 'Empresa',
          customerService: 'Servicio al Cliente',
          followUs: 'Síguenos',
          newsletter: 'Boletín',
          subscribe: 'Suscribirse',
          emailPlaceholder: 'Ingresa tu email',
          allRightsReserved: 'Todos los derechos reservados',
          privacyPolicy: 'Política de Privacidad',
          termsOfService: 'Términos de Servicio',
          shippingInfo: 'Información de Envío',
          returnPolicy: 'Política de Devoluciones',
          faq: 'Preguntas Frecuentes'
        },

        // Additional form elements
        forms: {
          firstName: 'Nombre',
          lastName: 'Apellido',
          email: 'Correo Electrónico',
          phone: 'Teléfono',
          address: 'Dirección',
          city: 'Ciudad',
          state: 'Estado/Provincia',
          zipCode: 'Código Postal',
          country: 'País',
          password: 'Contraseña',
          confirmPassword: 'Confirmar Contraseña',
          createAccount: 'Crear Cuenta',
          rememberMe: 'Recordarme',
          forgotPassword: '¿Olvidaste tu contraseña?',
          resetPassword: 'Restablecer Contraseña',
          login: 'Iniciar Sesión',
          register: 'Registrarse',
          newsletterSignup: 'Suscríbete a nuestro boletín',
          agreeTerms: 'Acepto los Términos de Servicio',
          subscribe: 'Suscribirse'
        },

        // Additional error and success messages
        errors: {
          requiredField: 'Este campo es obligatorio',
          invalidEmail: 'Por favor ingresa un email válido',
          passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
          passwordsNotMatch: 'Las contraseñas no coinciden',
          invalidPhone: 'Por favor ingresa un número de teléfono válido',
          invalidZipCode: 'Por favor ingresa un código postal válido',
          couponInvalid: 'Código de cupón inválido',
          outOfStock: 'Este artículo está agotado',
          minimumOrder: 'El monto mínimo de pedido es $10',
          paymentFailed: 'El pago falló. Por favor intenta de nuevo',
          shippingAddressRequired: 'La dirección de envío es obligatoria',
          billingAddressRequired: 'La dirección de facturación es obligatoria',
          invalidCardNumber: 'Por favor ingresa un número de tarjeta válido',
          invalidExpiryDate: 'Por favor ingresa una fecha de expiración válida',
          invalidCvv: 'Por favor ingresa un CVV válido',
          insufficientStock: 'Stock insuficiente para algunos artículos',
          maximumQuantity: 'Cantidad máxima excedida',
          duplicateEmail: 'Este email ya está registrado',
          accountNotFound: 'Cuenta no encontrada',
          invalidCredentials: 'Email o contraseña inválidos',
          accountLocked: 'La cuenta está temporalmente bloqueada',
          sessionExpired: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo',
          networkError: 'Error de red. Por favor verifica tu conexión',
          serverError: 'Error del servidor. Por favor intenta de nuevo más tarde',
          orderNotFound: 'Pedido no encontrado',
          paymentDeclined: 'El pago fue rechazado',
          addressNotFound: 'Dirección no encontrada',
          productNotFound: 'Producto no encontrado',
          categoryNotFound: 'Categoría no encontrada',
          insufficientPermissions: 'Permisos insuficientes',
          rateLimitExceeded: 'Demasiadas solicitudes. Por favor intenta de nuevo más tarde'
        },

        success: {
          couponApplied: 'Cupón aplicado exitosamente',
          accountCreated: 'Cuenta creada exitosamente',
          passwordReset: 'Email de restablecimiento enviado',
          reviewSubmitted: 'Reseña enviada exitosamente',
          newsletterSubscribed: 'Suscripción al boletín exitosa',
          orderPlaced: 'Pedido realizado exitosamente',
          paymentProcessed: 'Pago procesado exitosamente',
          addressSaved: 'Dirección guardada exitosamente',
          profileUpdated: 'Perfil actualizado exitosamente',
          passwordChanged: 'Contraseña cambiada exitosamente',
          wishlistUpdated: 'Lista de deseos actualizada exitosamente',
          itemAddedToCart: 'Artículo agregado al carrito exitosamente',
          itemRemovedFromCart: 'Artículo removido del carrito exitosamente',
          subscriptionUpdated: 'Suscripción actualizada exitosamente',
          notificationSettingsUpdated: 'Configuración de notificaciones actualizada exitosamente',
          languageChanged: 'Idioma cambiado exitosamente',
          currencyChanged: 'Moneda cambiada exitosamente',
          loginSuccessful: 'Inicio de sesión exitoso',
          logoutSuccessful: 'Cierre de sesión exitoso',
          registrationSuccessful: 'Registro exitoso',
          emailVerified: 'Email verificado exitosamente',
          orderCancelled: 'Pedido cancelado exitosamente',
          refundProcessed: 'Reembolso procesado exitosamente'
        },

        // Currency and pricing
        currency: {
          symbol: '$',
          code: 'CLP',
          format: 'es-CL'
        },

        // Regional variations for Latin America
        regional: {
          chile: {
            currencySymbol: 'CLP $',
            currencyFormat: 'es-CL',
            countryName: 'Chile',
            regionName: 'América Latina',
            postalCodeName: 'Código Postal',
            stateName: 'Región',
            phoneCode: '+56',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h'
          },
          // Common Latin American terms
          commonTerms: {
            neighborhood: 'Barrio/Comuna',
            municipality: 'Municipio/Comuna',
            province: 'Provincia/Región',
            department: 'Departamento',
            district: 'Distrito'
          }
        },

        // Payment methods common in Latin America
        paymentMethods: {
          creditCard: 'Tarjeta de Crédito',
          debitCard: 'Tarjeta de Débito',
          bankTransfer: 'Transferencia Bancaria',
          cashOnDelivery: 'Contra Entrega',
          digitalWallet: 'Billetera Digital',
          installments: 'Cuotas',
          onePayment: 'Un solo pago',
          twoPayments: '2 cuotas',
          threePayments: '3 cuotas',
          sixPayments: '6 cuotas',
          twelvePayments: '12 cuotas'
        },

        // Chilean specific terms
        chileanTerms: {
          rut: 'RUT',
          rutPlaceholder: '12.345.678-9',
          boleta: 'Boleta',
          factura: 'Factura',
          despacho: 'Despacho',
          retiro: 'Retiro en Tienda',
          sucursal: 'Sucursal',
          puntoDeRetiro: 'Punto de Retiro'
        },

        // Date and time
        date: {
          today: 'Hoy',
          yesterday: 'Ayer',
          tomorrow: 'Mañana',
          days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        },

        // Footer specific
        footer: {
          quickLinks: 'Enlaces Rápidos',
          customerService: 'Servicio al Cliente',
          contactInfo: 'Información de Contacto',
          helpCenter: 'Centro de Ayuda',
          shippingInfo: 'Información de Envío',
          returnsExchanges: 'Devoluciones y Cambios',
          sizeGuide: 'Guía de Tallas',
          privacyPolicy: 'Política de Privacidad',
          termsOfService: 'Términos de Servicio',
          cookiePolicy: 'Política de Cookies',
          allRightsReserved: 'Todos los derechos reservados.',
          address: '123 Comercio St, Ciudad, País',
          phone: '+1 (555) 123-4567',
          email: 'soporte@aramacbranfing.com'
        },

        // Product specific
        productCard: {
          new: 'Nuevo',
          fresh: 'Fresco',
          popular: 'Popular',
          noImage: 'Sin Imagen',
          adding: 'Agregando...',
          viewDetails: 'Ver Detalles',
          seoScore: 'Puntuación SEO'
        },

        // Product detail page
        productDetail: {
          seoOptimizationScore: 'Puntuación de Optimización SEO',
          seoOptimizationDesc: 'Optimización impulsada por IA para mejor visibilidad',
          excellent: 'Excelente',
          good: 'Bueno',
          needsImprovement: 'Necesita Mejora',
          description: 'Descripción',
          specifications: 'Especificaciones',
          reviews: 'Reseñas',
          technicalSpecifications: 'Especificaciones Técnicas',
          dimensions: 'Dimensiones',
          weight: 'Peso',
          material: 'Material',
          additionalFeatures: 'Características Adicionales',
          premiumQualityMaterials: 'Materiales de calidad premium',
          manufacturerWarranty: 'Garantía del fabricante',
          freeShipping: 'Envío gratuito',
          premiumQuality: 'Calidad Premium'
        },

        // Admin functionality
        admin: {
          dashboard: 'Panel de Control',
          analytics: 'Analíticas',
          orders: 'Pedidos',
          customers: 'Clientes',
          products: 'Productos',
          settings: 'Configuración',
          content: 'Contenido',
          seo: 'SEO',
          users: 'Usuarios',
          revenue: 'Ingresos',
          inventory: 'Inventario',
          reports: 'Reportes',
          notifications: 'Notificaciones',
          promotions: 'Promociones',
          affiliates: 'Afiliados',
          advanced: 'Avanzado',
          orderManagement: 'Gestión de Pedidos',
          searchOrders: 'Buscar pedidos',
          filterByStatus: 'Filtrar por estado',
          orderNumber: 'Pedido #',
          customerName: 'Nombre del Cliente',
          orderDate: 'Fecha del Pedido',
          orderStatus: 'Estado del Pedido',
          orderTotal: 'Total del Pedido',
          viewOrder: 'Ver Pedido',
          editOrder: 'Editar Pedido',
          shipOrder: 'Enviar Pedido',
          cancelOrder: 'Cancelar Pedido',
          processRefund: 'Procesar Reembolso',
          customerService: 'Servicio al Cliente',
          supportTickets: 'Tickets de Soporte',
          reviews: 'Reseñas',
          analyticsOverview: 'Resumen de Analíticas',
          salesPerformance: 'Rendimiento de Ventas',
          customerInsights: 'Información de Clientes',
          productPerformance: 'Rendimiento de Productos',
          seoAnalytics: 'Analíticas SEO',
          trafficSources: 'Fuentes de Tráfico',
          conversionRate: 'Tasa de Conversión',
          averageOrderValue: 'Valor Promedio de Pedido',
          customerRetention: 'Retención de Clientes',
          inventoryManagement: 'Gestión de Inventario',
          stockLevels: 'Niveles de Stock',
          lowStockAlerts: 'Alertas de Stock Bajo',
          outOfStockItems: 'Artículos Agotados',
          reorderPoints: 'Puntos de Reorden',
          supplierManagement: 'Gestión de Proveedores',
          bulkOperations: 'Operaciones Masivas',
          importExport: 'Importar/Exportar',
          systemSettings: 'Configuración del Sistema',
          paymentSettings: 'Configuración de Pagos',
          shippingSettings: 'Configuración de Envío',
          taxSettings: 'Configuración de Impuestos',
          emailSettings: 'Configuración de Email',
          apiSettings: 'Configuración de API',
          securitySettings: 'Configuración de Seguridad',
          backupRestore: 'Copia de Seguridad y Restauración',
          systemMaintenance: 'Mantenimiento del Sistema'
        },

        // Order statuses
        orderStatus: {
          pending: 'Pendiente',
          processing: 'Procesando',
          confirmed: 'Confirmado',
          shipped: 'Enviado',
          delivered: 'Entregado',
          cancelled: 'Cancelado',
          refunded: 'Reembolsado',
          onHold: 'En Espera',
          backordered: 'En Reserva',
          returned: 'Devuelto',
          failed: 'Fallido'
        },

        // Tracking and shipping
        tracking: {
          trackingNumber: 'Número de Seguimiento',
          carrier: 'Transportista',
          estimatedDelivery: 'Entrega Estimada',
          shippingMethod: 'Método de Envío',
          trackingHistory: 'Historial de Seguimiento',
          shipped: 'Enviado',
          inTransit: 'En Tránsito',
          outForDelivery: 'En Ruta de Entrega',
          delivered: 'Entregado',
          deliveryAttempted: 'Intento de Entrega',
          awaitingPickup: 'Esperando Recogida',
          returnedToSender: 'Devuelto al Remitente'
        },

        // Refund and cancellation
        refund: {
          refundRequest: 'Solicitud de Reembolso',
          refundStatus: 'Estado del Reembolso',
          refundAmount: 'Monto del Reembolso',
          refundReason: 'Razón del Reembolso',
          processingRefund: 'Procesando Reembolso',
          refundCompleted: 'Reembolso Completado',
          refundDenied: 'Reembolso Denegado',
          partialRefund: 'Reembolso Parcial',
          fullRefund: 'Reembolso Total',
          cancelOrder: 'Cancelar Pedido',
          cancellationReason: 'Razón de Cancelación',
          orderCancelled: 'Pedido Cancelado',
          cancellationPolicy: 'Política de Cancelación'
        },

        // Home page specific
        home: {
          heroBadge: '✨ Nueva Experiencia de Compra con IA',
          heroTitle: 'Descubre Productos Premium',
          heroSubtitle: 'Compra con confianza usando nuestras recomendaciones impulsadas por IA y experiencia de compra personalizada',
          shopNow: 'Comprar Ahora',
          viewAll: 'Ver Todo',
          freeShipping: 'Envío Gratis',
          freeShippingDesc: 'Entrega gratuita en pedidos sobre $50',
          securePayment: 'Pago Seguro',
          securePaymentDesc: 'Encriptación SSL de 256 bits',
          easyReturns: 'Devoluciones Fáciles',
          easyReturnsDesc: 'Política de devolución de 30 días',
          categoriesTitle: 'Comprar por Categoría',
          categoriesSubtitle: 'Explora nuestra amplia gama de productos premium',
          featuredProducts: 'Productos Destacados',
          featuredProductsDesc: 'Descubre nuestra selección seleccionada de productos premium',
          aiRecommendations: 'Recomendaciones Personalizadas con IA',
          aiRecommendationsDesc: 'Obtén recomendaciones de productos personalizadas basadas en tus preferencias',
          aiOptimizationTitle: 'Optimización con IA',
          aiOptimizationDesc: 'Nuestra IA optimiza continuamente los listados de productos, genera contenido amigable para SEO y asegura máxima visibilidad en los motores de búsqueda',
          averageSeoScore: 'Puntuación SEO Promedio',
          seoScoreDesc: 'Descripciones de productos y meta tags optimizados con IA para mejores rankings de búsqueda',
          aiGeneratedCollections: 'Colecciones Generadas por IA',
          aiCollectionsDesc: 'Agrupaciones inteligentes de productos basadas en el comportamiento del cliente y tendencias',
          seoMonitoring: 'Monitoreo SEO',
          seoMonitoringDesc: 'Seguimiento continuo del rendimiento y sugerencias de optimización',
          ctaTitle: '¿Listo para Experimentar Compras Inteligentes?',
          ctaSubtitle: 'Únete a miles de clientes satisfechos que confían en nuestra plataforma impulsada por IA para sus necesidades de compra.',
          startShopping: 'Comenzar a Comprar',
          learnMore: 'Saber Más'
        }
      };

    super(
      'es',
      {
        siteName: 'Tienda de Lujo en Línea',
        description: 'Productos de lujo premium con SEO optimizado por IA',
        keywords: ['lujo', 'premium', 'calidad', 'diseñador', 'moda', 'accesorios'],
        metaTags: {
          'og:type': 'website',
          'og:site_name': 'Tienda de Lujo en Línea',
          'twitter:card': 'summary_large_image',
          'twitter:title': 'Tienda de Lujo en Línea',
          'twitter:description': 'Productos de lujo premium con SEO optimizado por IA',
        }
      },
      translations
    );
  }
}

// Export singleton instance
const spanishProvider = new SpanishLanguageProvider();
export default spanishProvider;