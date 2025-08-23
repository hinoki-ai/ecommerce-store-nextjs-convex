/**
 * Arabic Language Chunk
 * Complete language implementation for Arabic (ar) with RTL support
 */

import { BaseLanguageProvider } from '../providers/language-provider';

export class ArabicLanguageProvider extends BaseLanguageProvider {
  constructor() {
    super(
      'ar',
      {
        siteName: 'متجر الفخامة الإلكتروني',
        description: 'منتجات فاخرة مميزة مع تحسين SEO بالذكاء الاصطناعي',
        keywords: ['فخامة', 'مميز', 'جودة', 'مصمم', 'أزياء', 'إكسسوارات'],
        metaTags: {
          'og:type': 'website',
          'og:site_name': 'متجر الفخامة الإلكتروني',
          'twitter:card': 'summary_large_image',
          'twitter:title': 'متجر الفخامة الإلكتروني',
          'twitter:description': 'منتجات فاخرة مميزة مع تحسين SEO بالذكاء الاصطناعي',
        }
      },
      {
        // Navigation
        nav: {
          home: 'الرئيسية',
          products: 'المنتجات',
          categories: 'الفئات',
          collections: 'المجموعات',
          blog: 'المدونة',
          about: 'من نحن',
          contact: 'اتصل بنا',
          cart: 'سلة التسوق',
          wishlist: 'قائمة الرغبات',
          account: 'حسابي',
          search: 'بحث',
          signIn: 'تسجيل الدخول',
          signUp: 'إنشاء حساب'
        },

        // Common UI elements
        common: {
          loading: 'جارٍ التحميل...',
          error: 'خطأ',
          success: 'نجح',
          warning: 'تحذير',
          info: 'معلومات',
          cancel: 'إلغاء',
          confirm: 'تأكيد',
          save: 'حفظ',
          delete: 'حذف',
          edit: 'تعديل',
          add: 'إضافة',
          remove: 'إزالة',
          back: 'العودة',
          next: 'التالي',
          previous: 'السابق',
          close: 'إغلاق',
          open: 'فتح'
        },

        // Product related
        product: {
          price: 'السعر',
          originalPrice: 'السعر الأصلي',
          discount: 'خصم',
          inStock: 'متوفر',
          outOfStock: 'غير متوفر',
          addToCart: 'إضافة للسلة',
          buyNow: 'اشترِ الآن',
          description: 'الوصف',
          specifications: 'المواصفات',
          reviews: 'التقييمات',
          relatedProducts: 'منتجات ذات صلة',
          quantity: 'الكمية',
          size: 'المقاس',
          color: 'اللون',
          material: 'المادة',
          brand: 'العلامة التجارية',
          sku: 'رمز المنتج',
          availability: 'التوفر',
          notFound: 'المنتج غير موجود',
          notFoundDesc: 'المنتج الذي تبحث عنه غير موجود أو تم حذفه.',
          browseProducts: 'تصفح المنتجات'
        },

        // Cart and checkout
        cart: {
          title: 'سلة التسوق',
          empty: 'سلة التسوق فارغة',
          subtotal: 'المجموع الفرعي',
          tax: 'الضرائب',
          shipping: 'الشحن',
          total: 'المجموع',
          checkout: 'الدفع',
          continueShopping: 'متابعة التسوق',
          removeItem: 'إزالة المنتج',
          updateQuantity: 'تحديث الكمية'
        },

        // User account
        account: {
          profile: 'الملف الشخصي',
          orders: 'الطلبات',
          addresses: 'العناوين',
          paymentMethods: 'طرق الدفع',
          settings: 'الإعدادات',
          logout: 'تسجيل الخروج',
          login: 'تسجيل الدخول',
          register: 'إنشاء حساب',
          forgotPassword: 'نسيت كلمة المرور؟',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          firstName: 'الاسم الأول',
          lastName: 'اسم العائلة',
          phone: 'الهاتف'
        },

        // SEO and content
        seo: {
          luxury: 'فخامة',
          premium: 'مميز',
          quality: 'جودة',
          designer: 'مصمم',
          fashion: 'أزياء',
          accessories: 'إكسسوارات',
          beauty: 'جمال',
          home: 'منزل',
          electronics: 'إلكترونيات'
        },

        // Hero and main content
        hero: {
          title: 'مرحباً بك في متجر الفخامة الإلكتروني',
          subtitle: 'منتجات فاخرة مميزة مع تحسين SEO بالذكاء الاصطناعي',
          newBadge: '✨ تجربة تسوق جديدة مدعومة بالذكاء الاصطناعي',
          shopNow: 'تسوق الآن',
          featuredProducts: 'المنتجات المميزة',
          exploreCategories: 'استكشف الفئات'
        },

        // Categories
        categories: {
          electronics: 'الإلكترونيات',
          clothing: 'الملابس',
          homeGarden: 'المنزل والحديقة',
          sports: 'الرياضة',
          beauty: 'الجمال',
          books: 'الكتب',
          toys: 'الألعاب',
          automotive: 'السيارات'
        },

        // Features/Benefits
        features: {
          freeShipping: 'شحن مجاني',
          freeShippingDesc: 'شحن مجاني على الطلبات التي تزيد عن 100 دولار',
          securePayment: 'دفع آمن',
          securePaymentDesc: 'بيانات الدفع الخاصة بك آمنة معنا',
          easyReturns: 'إرجاع سهل',
          easyReturnsDesc: 'سياسة إرجاع لمدة 30 يوماً لجميع المنتجات',
          customerSupport: 'دعم 24/7',
          customerSupportDesc: 'احصل على المساعدة متى احتجت إليها'
        },

        // Collections and sections
        collections: 'المجموعات',
        blog: 'المدونة',
        about: 'من نحن',
        contact: 'اتصل بنا',

        // Product details
        productDetails: 'تفاصيل المنتج',
        specifications: 'المواصفات',
        reviews: 'التقييمات',
        relatedProducts: 'منتجات ذات صلة',
        customerReviews: 'تقييمات العملاء',
        writeReview: 'اكتب تقييماً',
        addToWishlist: 'إضافة لقائمة الرغبات',
        removeFromWishlist: 'إزالة من قائمة الرغبات',

        // Cart and checkout
        checkout: 'الدفع',
        continueShopping: 'متابعة التسوق',
        orderSummary: 'ملخص الطلب',
        subtotal: 'المجموع الفرعي',
        tax: 'الضرائب',
        shipping: 'الشحن',
        total: 'المجموع',
        applyCoupon: 'تطبيق الكوبون',
        couponCode: 'رمز الكوبون',
        haveAccount: 'هل لديك حساب؟',
        signIn: 'تسجيل الدخول',
        guestCheckout: 'الدفع كضيف',
        billingAddress: 'عنوان الفواتير',
        shippingAddress: 'عنوان الشحن',
        paymentMethod: 'طريقة الدفع',
        placeOrder: 'تقديم الطلب',
        orderConfirmation: 'تأكيد الطلب',
        thankYou: 'شكراً لك على طلبك!',
        orderNumber: 'رقم الطلب',

        // Footer
        footer: {
          company: 'الشركة',
          customerService: 'خدمة العملاء',
          followUs: 'تابعنا',
          newsletter: 'النشرة الإخبارية',
          subscribe: 'اشتراك',
          emailPlaceholder: 'أدخل بريدك الإلكتروني',
          allRightsReserved: 'جميع الحقوق محفوظة',
          privacyPolicy: 'سياسة الخصوصية',
          termsOfService: 'شروط الخدمة',
          shippingInfo: 'معلومات الشحن',
          returnPolicy: 'سياسة الإرجاع',
          faq: 'الأسئلة الشائعة'
        },

        // Additional form elements
        forms: {
          firstName: 'الاسم الأول',
          lastName: 'اسم العائلة',
          email: 'البريد الإلكتروني',
          phone: 'الهاتف',
          address: 'العنوان',
          city: 'المدينة',
          state: 'المحافظة',
          zipCode: 'الرمز البريدي',
          country: 'الدولة',
          password: 'كلمة المرور',
          confirmPassword: 'تأكيد كلمة المرور',
          createAccount: 'إنشاء حساب',
          rememberMe: 'تذكرني',
          forgotPassword: 'نسيت كلمة المرور؟',
          resetPassword: 'إعادة تعيين كلمة المرور',
          login: 'تسجيل الدخول',
          register: 'إنشاء حساب',
          newsletterSignup: 'اشتراك في نشرتنا الإخبارية',
          agreeTerms: 'أوافق على شروط الخدمة',
          subscribe: 'اشتراك',
          placeholder: {
            email: 'بريدك@الإلكتروني.com',
            name: 'اسمك',
            message: 'رسالتك هنا...',
            search: 'البحث عن منتجات...'
          }
        },

        // Additional error and success messages
        errors: {
          requiredField: 'هذا الحقل مطلوب',
          invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
          passwordTooShort: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
          passwordsNotMatch: 'كلمات المرور غير متطابقة',
          invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
          invalidZipCode: 'يرجى إدخال رمز بريدي صحيح',
          couponInvalid: 'رمز الكوبون غير صحيح',
          outOfStock: 'هذا المنتج غير متوفر',
          minimumOrder: 'الحد الأدنى للطلب 10 دولارات',
          paymentFailed: 'فشل الدفع. يرجى المحاولة مرة أخرى',
          shippingAddressRequired: 'عنوان الشحن مطلوب',
          billingAddressRequired: 'عنوان الفواتير مطلوب',
          invalidCardNumber: 'يرجى إدخال رقم بطاقة صحيح',
          invalidExpiryDate: 'يرجى إدخال تاريخ انتهاء صحيح',
          invalidCvv: 'يرجى إدخال CVV صحيح',
          insufficientStock: 'مخزون غير كافي لبعض المنتجات',
          maximumQuantity: 'تم تجاوز الكمية القصوى',
          duplicateEmail: 'هذا البريد الإلكتروني مسجل بالفعل',
          accountNotFound: 'الحساب غير موجود',
          invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
          accountLocked: 'الحساب مقفل مؤقتاً',
          sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى',
          networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك',
          serverError: 'خطأ في الخادم. يرجى المحاولة لاحقاً',
          orderNotFound: 'الطلب غير موجود',
          paymentDeclined: 'تم رفض الدفع',
          addressNotFound: 'العنوان غير موجود',
          productNotFound: 'المنتج غير موجود',
          categoryNotFound: 'الفئة غير موجودة',
          insufficientPermissions: 'صلاحيات غير كافية',
          rateLimitExceeded: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً'
        },

        success: {
          couponApplied: 'تم تطبيق الكوبون بنجاح',
          accountCreated: 'تم إنشاء الحساب بنجاح',
          passwordReset: 'تم إرسال بريد إلكتروني إعادة تعيين كلمة المرور',
          reviewSubmitted: 'تم إرسال التقييم بنجاح',
          newsletterSubscribed: 'تم الاشتراك في النشرة الإخبارية بنجاح',
          orderPlaced: 'تم تقديم الطلب بنجاح',
          paymentProcessed: 'تم معالجة الدفع بنجاح',
          addressSaved: 'تم حفظ العنوان بنجاح',
          profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
          passwordChanged: 'تم تغيير كلمة المرور بنجاح',
          wishlistUpdated: 'تم تحديث قائمة الرغبات بنجاح',
          itemAddedToCart: 'تم إضافة المنتج للسلة بنجاح',
          itemRemovedFromCart: 'تم إزالة المنتج من السلة بنجاح',
          subscriptionUpdated: 'تم تحديث الاشتراك بنجاح',
          notificationSettingsUpdated: 'تم تحديث إعدادات الإشعارات بنجاح',
          languageChanged: 'تم تغيير اللغة بنجاح',
          currencyChanged: 'تم تغيير العملة بنجاح',
          loginSuccessful: 'تم تسجيل الدخول بنجاح',
          logoutSuccessful: 'تم تسجيل الخروج بنجاح',
          registrationSuccessful: 'تم التسجيل بنجاح',
          emailVerified: 'تم التحقق من البريد الإلكتروني بنجاح',
          orderCancelled: 'تم إلغاء الطلب بنجاح',
          refundProcessed: 'تم معالجة الاسترداد بنجاح'
        },

        // Currency and pricing
        currency: {
          symbol: 'ر.س',
          code: 'SAR',
          format: 'ar-SA'
        },

        // Regional variations for Saudi Arabia/Arabic countries
        regional: {
          saudiArabia: {
            currencySymbol: 'ر.س',
            currencyFormat: 'ar-SA',
            countryName: 'المملكة العربية السعودية',
            regionName: 'الشرق الأوسط',
            postalCodeName: 'الرمز البريدي',
            stateName: 'المنطقة',
            phoneCode: '+966',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '12h'
          },
          commonTerms: {
            neighborhood: 'الحي',
            municipality: 'البلدية',
            province: 'المنطقة',
            department: 'القسم',
            district: 'المقاطعة'
          }
        },

        // Payment methods common in Arabic countries
        paymentMethods: {
          creditCard: 'بطاقة ائتمان',
          debitCard: 'بطاقة خصم',
          bankTransfer: 'تحويل بنكي',
          cashOnDelivery: 'الدفع عند الاستلام',
          digitalWallet: 'محفظة رقمية',
          installments: 'التقسيط',
          onePayment: 'دفعة واحدة',
          twoPayments: 'دفعتان',
          threePayments: '3 دفعات',
          sixPayments: '6 دفعات',
          twelvePayments: '12 دفعة'
        },

        // Date and time
        date: {
          today: 'اليوم',
          yesterday: 'الأمس',
          tomorrow: 'غداً',
          days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
          months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        },

        // Footer specific
        footer: {
          quickLinks: 'روابط سريعة',
          customerService: 'خدمة العملاء',
          contactInfo: 'معلومات الاتصال',
          helpCenter: 'مركز المساعدة',
          shippingInfo: 'معلومات الشحن',
          returnsExchanges: 'الإرجاع والتبديل',
          sizeGuide: 'دليل المقاسات',
          privacyPolicy: 'سياسة الخصوصية',
          termsOfService: 'شروط الخدمة',
          cookiePolicy: 'سياسة ملفات تعريف الارتباط',
          allRightsReserved: 'جميع الحقوق محفوظة.',
          address: '123 شارع التجارة، المدينة، الدولة',
          phone: '+966 11 234 5678',
          email: 'support@luxurystore.sa'
        },

        // Product specific
        productCard: {
          new: 'جديد',
          fresh: 'طازج',
          popular: 'شائع',
          noImage: 'لا توجد صورة',
          adding: 'جارٍ الإضافة...',
          viewDetails: 'عرض التفاصيل',
          seoScore: 'درجة SEO'
        },

        // Product detail page
        productDetail: {
          seoOptimizationScore: 'درجة تحسين SEO',
          seoOptimizationDesc: 'تحسين مدعوم بالذكاء الاصطناعي لزيادة الظهور',
          excellent: 'ممتاز',
          good: 'جيد',
          needsImprovement: 'يحتاج تحسين',
          description: 'الوصف',
          specifications: 'المواصفات',
          reviews: 'التقييمات',
          technicalSpecifications: 'المواصفات التقنية',
          dimensions: 'الأبعاد',
          weight: 'الوزن',
          material: 'المادة',
          additionalFeatures: 'مميزات إضافية',
          premiumQualityMaterials: 'مواد عالية الجودة',
          manufacturerWarranty: 'ضمان الشركة المصنعة',
          freeShipping: 'شحن مجاني',
          premiumQuality: 'جودة ممتازة'
        },

        // Admin functionality
        admin: {
          dashboard: 'لوحة التحكم',
          analytics: 'التحليلات',
          orders: 'الطلبات',
          customers: 'العملاء',
          products: 'المنتجات',
          settings: 'الإعدادات',
          content: 'المحتوى',
          seo: 'SEO',
          users: 'المستخدمون',
          revenue: 'الإيرادات',
          inventory: 'المخزون',
          reports: 'التقارير',
          notifications: 'الإشعارات',
          promotions: 'العروض',
          affiliates: 'الشركاء',
          advanced: 'متقدم',
          orderManagement: 'إدارة الطلبات',
          searchOrders: 'البحث في الطلبات',
          filterByStatus: 'تصفية حسب الحالة',
          orderNumber: 'رقم الطلب',
          customerName: 'اسم العميل',
          orderDate: 'تاريخ الطلب',
          orderStatus: 'حالة الطلب',
          orderTotal: 'إجمالي الطلب',
          viewOrder: 'عرض الطلب',
          editOrder: 'تعديل الطلب',
          shipOrder: 'شحن الطلب',
          cancelOrder: 'إلغاء الطلب',
          processRefund: 'معالجة الاسترداد',
          customerService: 'خدمة العملاء',
          supportTickets: 'تذاكر الدعم',
          reviews: 'التقييمات',
          analyticsOverview: 'نظرة عامة على التحليلات',
          salesPerformance: 'أداء المبيعات',
          customerInsights: 'رؤى العملاء',
          productPerformance: 'أداء المنتجات',
          seoAnalytics: 'تحليلات SEO',
          trafficSources: 'مصادر الزيارات',
          conversionRate: 'معدل التحويل',
          averageOrderValue: 'متوسط قيمة الطلب',
          customerRetention: 'احتفاظ العملاء',
          inventoryManagement: 'إدارة المخزون',
          stockLevels: 'مستويات المخزون',
          lowStockAlerts: 'تنبيهات المخزون المنخفض',
          outOfStockItems: 'المنتجات غير المتوفرة',
          reorderPoints: 'نقاط إعادة الطلب',
          supplierManagement: 'إدارة الموردين',
          bulkOperations: 'العمليات المجمعة',
          importExport: 'الاستيراد والتصدير',
          systemSettings: 'إعدادات النظام',
          paymentSettings: 'إعدادات الدفع',
          shippingSettings: 'إعدادات الشحن',
          taxSettings: 'إعدادات الضرائب',
          emailSettings: 'إعدادات البريد الإلكتروني',
          apiSettings: 'إعدادات API',
          securitySettings: 'إعدادات الأمان',
          backupRestore: 'النسخ الاحتياطي والاستعادة',
          systemMaintenance: 'صيانة النظام'
        },

        // Order statuses
        orderStatus: {
          pending: 'في الانتظار',
          processing: 'قيد المعالجة',
          confirmed: 'مؤكد',
          shipped: 'تم الشحن',
          delivered: 'تم التسليم',
          cancelled: 'ملغي',
          refunded: 'مسترد',
          onHold: 'متوقف',
          backordered: 'في الانتظار',
          returned: 'مرتجع',
          failed: 'فاشل'
        },

        // Tracking and shipping
        tracking: {
          trackingNumber: 'رقم التتبع',
          carrier: 'شركة الشحن',
          estimatedDelivery: 'التسليم المتوقع',
          shippingMethod: 'طريقة الشحن',
          trackingHistory: 'تاريخ التتبع',
          shipped: 'تم الشحن',
          inTransit: 'في الطريق',
          outForDelivery: 'خارج للتسليم',
          delivered: 'تم التسليم',
          deliveryAttempted: 'تم محاولة التسليم',
          awaitingPickup: 'في انتظار الاستلام',
          returnedToSender: 'مرتجع للمرسل'
        },

        // Refund and cancellation
        refund: {
          refundRequest: 'طلب استرداد',
          refundStatus: 'حالة الاسترداد',
          refundAmount: 'مبلغ الاسترداد',
          refundReason: 'سبب الاسترداد',
          processingRefund: 'معالجة الاسترداد',
          refundCompleted: 'تم الاسترداد',
          refundDenied: 'تم رفض الاسترداد',
          partialRefund: 'استرداد جزئي',
          fullRefund: 'استرداد كامل',
          cancelOrder: 'إلغاء الطلب',
          cancellationReason: 'سبب الإلغاء',
          orderCancelled: 'تم إلغاء الطلب',
          cancellationPolicy: 'سياسة الإلغاء'
        },

        // Home page specific
        home: {
          heroBadge: '✨ تجربة تسوق جديدة مدعومة بالذكاء الاصطناعي',
          heroTitle: 'اكتشف المنتجات المميزة',
          heroSubtitle: 'تسوق بثقة باستخدام توصياتنا المدعومة بالذكاء الاصطناعي وتجربة التسوق الشخصية',
          shopNow: 'تسوق الآن',
          viewAll: 'عرض الكل',
          freeShipping: 'شحن مجاني',
          freeShippingDesc: 'شحن مجاني على الطلبات التي تزيد عن 50 دولار',
          securePayment: 'دفع آمن',
          securePaymentDesc: 'تشفير SSL 256-bit',
          easyReturns: 'إرجاع سهل',
          easyReturnsDesc: 'سياسة إرجاع لمدة 30 يوماً',
          categoriesTitle: 'تسوق حسب الفئة',
          categoriesSubtitle: 'استكشف مجموعتنا الواسعة من المنتجات المميزة',
          featuredProducts: 'المنتجات المميزة',
          featuredProductsDesc: 'اكتشف اختيارنا المختار بعناية من المنتجات المميزة',
          aiRecommendations: 'التوصيات الشخصية بالذكاء الاصطناعي',
          aiRecommendationsDesc: 'احصل على توصيات منتجات مخصصة بناءً على تفضيلاتك',
          aiOptimizationTitle: 'التحسين المدعوم بالذكاء الاصطناعي',
          aiOptimizationDesc: 'يقوم الذكاء الاصطناعي لدينا بتحسين بطاقات المنتجات باستمرار، وإنشاء محتوى محسن لـ SEO، وضمان أقصى ظهور على محركات البحث',
          averageSeoScore: 'متوسط درجة SEO',
          seoScoreDesc: 'أوصاف المنتجات والبيانات الوصفية المحسنة SEO لترتيب بحث أفضل',
          aiGeneratedCollections: 'المجموعات المولدة بالذكاء الاصطناعي',
          aiCollectionsDesc: 'تجميعات منتجات ذكية بناءً على سلوك العملاء والاتجاهات',
          seoMonitoring: 'مراقبة SEO',
          seoMonitoringDesc: 'تتبع الأداء المستمر واقتراحات التحسين',
          ctaTitle: 'مستعد للتسوق الذكي؟',
          ctaSubtitle: 'انضم إلى آلاف العملاء الراضين الذين يثقون في منصتنا المدعومة بالذكاء الاصطناعي لاحتياجاتهم في التسوق.',
          startShopping: 'ابدأ التسوق',
          learnMore: 'اعرف المزيد'
        }
      }
    );
  }
}

// Export singleton instance
const arabicProvider = new ArabicLanguageProvider();
export default arabicProvider;