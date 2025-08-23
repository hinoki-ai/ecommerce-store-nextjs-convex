/**
 * Russian Language Chunk
 * Complete language implementation for Russian (ru)
 */

import { BaseLanguageProvider } from '../providers/language-provider';

export class RussianLanguageProvider extends BaseLanguageProvider {
  constructor() {
    super(
      'ru',
      {
        siteName: 'Интернет-магазин Роскоши',
        description: 'Премиальные роскошные продукты с AI-оптимизированным SEO',
        keywords: ['роскошь', 'премиум', 'качество', 'дизайнер', 'мода', 'аксессуары'],
        metaTags: {
          'og:type': 'website',
          'og:site_name': 'Интернет-магазин Роскоши',
          'twitter:card': 'summary_large_image',
          'twitter:title': 'Интернет-магазин Роскоши',
          'twitter:description': 'Премиальные роскошные продукты с AI-оптимизированным SEO',
        }
      },
      {
        // Navigation
        nav: {
          home: 'Главная',
          products: 'Продукты',
          categories: 'Категории',
          collections: 'Коллекции',
          blog: 'Блог',
          about: 'О нас',
          contact: 'Контакты',
          cart: 'Корзина',
          wishlist: 'Список желаний',
          account: 'Мой аккаунт',
          search: 'Поиск',
          signIn: 'Войти',
          signUp: 'Регистрация'
        },

        // Common UI elements
        common: {
          loading: 'Загрузка...',
          error: 'Ошибка',
          success: 'Успех',
          warning: 'Предупреждение',
          info: 'Информация',
          cancel: 'Отмена',
          confirm: 'Подтвердить',
          save: 'Сохранить',
          delete: 'Удалить',
          edit: 'Редактировать',
          add: 'Добавить',
          remove: 'Удалить',
          back: 'Назад',
          next: 'Далее',
          previous: 'Назад',
          close: 'Закрыть',
          open: 'Открыть'
        },

        // Product related
        product: {
          price: 'Цена',
          originalPrice: 'Оригинальная цена',
          discount: 'Скидка',
          inStock: 'В наличии',
          outOfStock: 'Нет в наличии',
          addToCart: 'Добавить в корзину',
          buyNow: 'Купить сейчас',
          description: 'Описание',
          specifications: 'Характеристики',
          reviews: 'Отзывы',
          relatedProducts: 'Похожие товары',
          quantity: 'Количество',
          size: 'Размер',
          color: 'Цвет',
          material: 'Материал',
          brand: 'Бренд',
          sku: 'SKU',
          availability: 'Доступность',
          notFound: 'Продукт не найден',
          notFoundDesc: 'Искомый продукт не существует или был удален.',
          browseProducts: 'Просмотр товаров'
        },

        // Cart and checkout
        cart: {
          title: 'Корзина',
          empty: 'Ваша корзина пуста',
          subtotal: 'Промежуточный итог',
          tax: 'Налоги',
          shipping: 'Доставка',
          total: 'Итого',
          checkout: 'Оформить заказ',
          continueShopping: 'Продолжить покупки',
          removeItem: 'Удалить товар',
          updateQuantity: 'Обновить количество'
        },

        // User account
        account: {
          profile: 'Профиль',
          orders: 'Заказы',
          addresses: 'Адреса',
          paymentMethods: 'Способы оплаты',
          settings: 'Настройки',
          logout: 'Выйти',
          login: 'Войти',
          register: 'Регистрация',
          forgotPassword: 'Забыли пароль?',
          email: 'Электронная почта',
          password: 'Пароль',
          firstName: 'Имя',
          lastName: 'Фамилия',
          phone: 'Телефон'
        },

        // SEO and content
        seo: {
          luxury: 'роскошь',
          premium: 'премиум',
          quality: 'качество',
          designer: 'дизайнер',
          fashion: 'мода',
          accessories: 'аксессуары',
          beauty: 'красота',
          home: 'дом',
          electronics: 'электроника'
        },

        // Hero and main content
        hero: {
          title: 'Добро пожаловать в Интернет-магазин Роскоши',
          subtitle: 'Премиальные роскошные продукты с AI-оптимизированным SEO',
          newBadge: '✨ Новый AI-оптимизированный опыт покупок',
          shopNow: 'Купить сейчас',
          featuredProducts: 'Рекомендуемые товары',
          exploreCategories: 'Исследовать категории'
        },

        // Categories
        categories: {
          electronics: 'Электроника',
          clothing: 'Одежда',
          homeGarden: 'Дом и сад',
          sports: 'Спорт',
          beauty: 'Красота',
          books: 'Книги',
          toys: 'Игрушки',
          automotive: 'Автомобили'
        },

        // Features/Benefits
        features: {
          freeShipping: 'Бесплатная доставка',
          freeShippingDesc: 'Бесплатная доставка на заказы от 100 долларов',
          securePayment: 'Безопасная оплата',
          securePaymentDesc: 'Ваши платежные данные защищены у нас',
          easyReturns: 'Легкий возврат',
          easyReturnsDesc: '30-дневная политика возврата для всех товаров',
          customerSupport: 'Поддержка 24/7',
          customerSupportDesc: 'Получите помощь, когда вам это нужно'
        },

        // Collections and sections
        collections: 'Коллекции',
        blog: 'Блог',
        about: 'О нас',
        contact: 'Контакты',

        // Product details
        productDetails: 'Детали продукта',
        specifications: 'Характеристики',
        reviews: 'Отзывы',
        relatedProducts: 'Похожие товары',
        customerReviews: 'Отзывы клиентов',
        writeReview: 'Написать отзыв',
        addToWishlist: 'Добавить в список желаний',
        removeFromWishlist: 'Удалить из списка желаний',

        // Cart and checkout
        checkout: 'Оформление заказа',
        continueShopping: 'Продолжить покупки',
        orderSummary: 'Сводка заказа',
        subtotal: 'Промежуточный итог',
        tax: 'Налоги',
        shipping: 'Доставка',
        total: 'Итого',
        applyCoupon: 'Применить купон',
        couponCode: 'Код купона',
        haveAccount: 'У вас есть аккаунт?',
        signIn: 'Войти',
        guestCheckout: 'Оформление заказа без регистрации',
        billingAddress: 'Платежный адрес',
        shippingAddress: 'Адрес доставки',
        paymentMethod: 'Способ оплаты',
        placeOrder: 'Оформить заказ',
        orderConfirmation: 'Подтверждение заказа',
        thankYou: 'Спасибо за ваш заказ!',
        orderNumber: 'Номер заказа',

        // Footer
        footer: {
          company: 'Компания',
          customerService: 'Служба поддержки',
          followUs: 'Подписывайтесь на нас',
          newsletter: 'Рассылка',
          subscribe: 'Подписаться',
          emailPlaceholder: 'Введите ваш email',
          allRightsReserved: 'Все права защищены',
          privacyPolicy: 'Политика конфиденциальности',
          termsOfService: 'Условия использования',
          shippingInfo: 'Информация о доставке',
          returnPolicy: 'Политика возврата',
          faq: 'Часто задаваемые вопросы'
        },

        // Additional form elements
        forms: {
          firstName: 'Имя',
          lastName: 'Фамилия',
          email: 'Электронная почта',
          phone: 'Телефон',
          address: 'Адрес',
          city: 'Город',
          state: 'Область',
          zipCode: 'Индекс',
          country: 'Страна',
          password: 'Пароль',
          confirmPassword: 'Подтвердить пароль',
          createAccount: 'Создать аккаунт',
          rememberMe: 'Запомнить меня',
          forgotPassword: 'Забыли пароль?',
          resetPassword: 'Сбросить пароль',
          login: 'Войти',
          register: 'Регистрация',
          newsletterSignup: 'Подписаться на нашу рассылку',
          agreeTerms: 'Я согласен с условиями использования',
          subscribe: 'Подписаться',
          placeholder: {
            email: 'ваша@почта.com',
            name: 'Ваше имя',
            message: 'Ваше сообщение здесь...',
            search: 'Поиск товаров...'
          }
        },

        // Additional error and success messages
        errors: {
          requiredField: 'Это поле обязательно',
          invalidEmail: 'Пожалуйста, введите действительный адрес электронной почты',
          passwordTooShort: 'Пароль должен содержать не менее 8 символов',
          passwordsNotMatch: 'Пароли не совпадают',
          invalidPhone: 'Пожалуйста, введите действительный номер телефона',
          invalidZipCode: 'Пожалуйста, введите действительный индекс',
          couponInvalid: 'Недействительный код купона',
          outOfStock: 'Этот товар отсутствует на складе',
          minimumOrder: 'Минимальная сумма заказа 10 долларов',
          paymentFailed: 'Оплата не удалась. Пожалуйста, попробуйте еще раз',
          shippingAddressRequired: 'Адрес доставки обязателен',
          billingAddressRequired: 'Платежный адрес обязателен',
          invalidCardNumber: 'Пожалуйста, введите действительный номер карты',
          invalidExpiryDate: 'Пожалуйста, введите действительную дату истечения',
          invalidCvv: 'Пожалуйста, введите действительный CVV',
          insufficientStock: 'Недостаточно товара на складе для некоторых позиций',
          maximumQuantity: 'Превышено максимальное количество',
          duplicateEmail: 'Этот адрес электронной почты уже зарегистрирован',
          accountNotFound: 'Аккаунт не найден',
          invalidCredentials: 'Неверный адрес электронной почты или пароль',
          accountLocked: 'Аккаунт временно заблокирован',
          sessionExpired: 'Ваша сессия истекла. Пожалуйста, войдите снова',
          networkError: 'Ошибка сети. Пожалуйста, проверьте подключение',
          serverError: 'Ошибка сервера. Пожалуйста, попробуйте позже',
          orderNotFound: 'Заказ не найден',
          paymentDeclined: 'Платеж отклонен',
          addressNotFound: 'Адрес не найден',
          productNotFound: 'Продукт не найден',
          categoryNotFound: 'Категория не найдена',
          insufficientPermissions: 'Недостаточно прав',
          rateLimitExceeded: 'Слишком много запросов. Пожалуйста, попробуйте позже'
        },

        success: {
          couponApplied: 'Купон успешно применен',
          accountCreated: 'Аккаунт успешно создан',
          passwordReset: 'Письмо для сброса пароля отправлено',
          reviewSubmitted: 'Отзыв успешно отправлен',
          newsletterSubscribed: 'Успешно подписались на рассылку',
          orderPlaced: 'Заказ успешно оформлен',
          paymentProcessed: 'Платеж успешно обработан',
          addressSaved: 'Адрес успешно сохранен',
          profileUpdated: 'Профиль успешно обновлен',
          passwordChanged: 'Пароль успешно изменен',
          wishlistUpdated: 'Список желаний успешно обновлен',
          itemAddedToCart: 'Товар успешно добавлен в корзину',
          itemRemovedFromCart: 'Товар успешно удален из корзины',
          subscriptionUpdated: 'Подписка успешно обновлена',
          notificationSettingsUpdated: 'Настройки уведомлений успешно обновлены',
          languageChanged: 'Язык успешно изменен',
          currencyChanged: 'Валюта успешно изменена',
          loginSuccessful: 'Вход выполнен успешно',
          logoutSuccessful: 'Выход выполнен успешно',
          registrationSuccessful: 'Регистрация выполнена успешно',
          emailVerified: 'Электронная почта успешно подтверждена',
          orderCancelled: 'Заказ успешно отменен',
          refundProcessed: 'Возврат успешно обработан'
        },

        // Currency and pricing
        currency: {
          symbol: '₽',
          code: 'RUB',
          format: 'ru-RU'
        },

        // Regional variations for Russia
        regional: {
          russia: {
            currencySymbol: '₽',
            currencyFormat: 'ru-RU',
            countryName: 'Россия',
            regionName: 'Европа',
            postalCodeName: 'Индекс',
            stateName: 'Область',
            phoneCode: '+7',
            dateFormat: 'DD.MM.YYYY',
            timeFormat: '24h'
          },
          commonTerms: {
            neighborhood: 'Район',
            municipality: 'Муниципалитет',
            province: 'Область',
            department: 'Отдел',
            district: 'Округ'
          }
        },

        // Payment methods common in Russia
        paymentMethods: {
          creditCard: 'Кредитная карта',
          debitCard: 'Дебетовая карта',
          bankTransfer: 'Банковский перевод',
          cashOnDelivery: 'Оплата при доставке',
          digitalWallet: 'Электронный кошелек',
          installments: 'Рассрочка',
          onePayment: 'Единовременный платеж',
          twoPayments: '2 платежа',
          threePayments: '3 платежа',
          sixPayments: '6 платежей',
          twelvePayments: '12 платежей'
        },

        // Date and time
        date: {
          today: 'Сегодня',
          yesterday: 'Вчера',
          tomorrow: 'Завтра',
          days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
          months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
        },

        // Footer specific
        footer: {
          quickLinks: 'Быстрые ссылки',
          customerService: 'Служба поддержки',
          contactInfo: 'Контактная информация',
          helpCenter: 'Центр помощи',
          shippingInfo: 'Информация о доставке',
          returnsExchanges: 'Возвраты и обмен',
          sizeGuide: 'Таблица размеров',
          privacyPolicy: 'Политика конфиденциальности',
          termsOfService: 'Условия использования',
          cookiePolicy: 'Политика cookies',
          allRightsReserved: 'Все права защищены.',
          address: 'ул. Торговая, 123, Город, Страна',
          phone: '+7 (495) 123-45-67',
          email: 'support@luxurystore.ru'
        },

        // Product specific
        productCard: {
          new: 'Новинка',
          fresh: 'Свежее',
          popular: 'Популярное',
          noImage: 'Нет изображения',
          adding: 'Добавление...',
          viewDetails: 'Посмотреть детали',
          seoScore: 'SEO рейтинг'
        },

        // Product detail page
        productDetail: {
          seoOptimizationScore: 'Рейтинг SEO оптимизации',
          seoOptimizationDesc: 'AI-оптимизация для лучшей видимости',
          excellent: 'Отлично',
          good: 'Хорошо',
          needsImprovement: 'Нуждается в улучшении',
          description: 'Описание',
          specifications: 'Характеристики',
          reviews: 'Отзывы',
          technicalSpecifications: 'Технические характеристики',
          dimensions: 'Размеры',
          weight: 'Вес',
          material: 'Материал',
          additionalFeatures: 'Дополнительные функции',
          premiumQualityMaterials: 'Материалы премиум качества',
          manufacturerWarranty: 'Гарантия производителя',
          freeShipping: 'Бесплатная доставка',
          premiumQuality: 'Премиум качество'
        },

        // Admin functionality
        admin: {
          dashboard: 'Панель управления',
          analytics: 'Аналитика',
          orders: 'Заказы',
          customers: 'Клиенты',
          products: 'Продукты',
          settings: 'Настройки',
          content: 'Контент',
          seo: 'SEO',
          users: 'Пользователи',
          revenue: 'Доходы',
          inventory: 'Инвентарь',
          reports: 'Отчеты',
          notifications: 'Уведомления',
          promotions: 'Акции',
          affiliates: 'Партнеры',
          advanced: 'Расширенные',
          orderManagement: 'Управление заказами',
          searchOrders: 'Поиск заказов',
          filterByStatus: 'Фильтр по статусу',
          orderNumber: 'Заказ №',
          customerName: 'Имя клиента',
          orderDate: 'Дата заказа',
          orderStatus: 'Статус заказа',
          orderTotal: 'Итого по заказу',
          viewOrder: 'Просмотр заказа',
          editOrder: 'Редактирование заказа',
          shipOrder: 'Отправка заказа',
          cancelOrder: 'Отмена заказа',
          processRefund: 'Обработка возврата',
          customerService: 'Служба поддержки',
          supportTickets: 'Тикеты поддержки',
          reviews: 'Отзывы',
          analyticsOverview: 'Обзор аналитики',
          salesPerformance: 'Продажная производительность',
          customerInsights: 'Информация о клиентах',
          productPerformance: 'Производительность продукта',
          seoAnalytics: 'SEO аналитика',
          trafficSources: 'Источники трафика',
          conversionRate: 'Коэффициент конверсии',
          averageOrderValue: 'Средняя стоимость заказа',
          customerRetention: 'Удержание клиентов',
          inventoryManagement: 'Управление запасами',
          stockLevels: 'Уровни запасов',
          lowStockAlerts: 'Оповещения о низких запасах',
          outOfStockItems: 'Товары, отсутствующие на складе',
          reorderPoints: 'Точки повторного заказа',
          supplierManagement: 'Управление поставщиками',
          bulkOperations: 'Массовые операции',
          importExport: 'Импорт/Экспорт',
          systemSettings: 'Системные настройки',
          paymentSettings: 'Настройки оплаты',
          shippingSettings: 'Настройки доставки',
          taxSettings: 'Налоговые настройки',
          emailSettings: 'Настройки электронной почты',
          apiSettings: 'Настройки API',
          securitySettings: 'Настройки безопасности',
          backupRestore: 'Резервное копирование и восстановление',
          systemMaintenance: 'Системное обслуживание'
        },

        // Order statuses
        orderStatus: {
          pending: 'В ожидании',
          processing: 'В обработке',
          confirmed: 'Подтверждено',
          shipped: 'Отправлено',
          delivered: 'Доставлено',
          cancelled: 'Отменено',
          refunded: 'Возвращено',
          onHold: 'Приостановлено',
          backordered: 'На заказе',
          returned: 'Возвращено',
          failed: 'Неудачно'
        },

        // Tracking and shipping
        tracking: {
          trackingNumber: 'Номер отслеживания',
          carrier: 'Перевозчик',
          estimatedDelivery: 'Ожидаемая доставка',
          shippingMethod: 'Способ доставки',
          trackingHistory: 'История отслеживания',
          shipped: 'Отправлено',
          inTransit: 'В пути',
          outForDelivery: 'На доставке',
          delivered: 'Доставлено',
          deliveryAttempted: 'Попытка доставки',
          awaitingPickup: 'Ожидает получения',
          returnedToSender: 'Возвращено отправителю'
        },

        // Refund and cancellation
        refund: {
          refundRequest: 'Запрос на возврат',
          refundStatus: 'Статус возврата',
          refundAmount: 'Сумма возврата',
          refundReason: 'Причина возврата',
          processingRefund: 'Обработка возврата',
          refundCompleted: 'Возврат завершен',
          refundDenied: 'Возврат отклонен',
          partialRefund: 'Частичный возврат',
          fullRefund: 'Полный возврат',
          cancelOrder: 'Отменить заказ',
          cancellationReason: 'Причина отмены',
          orderCancelled: 'Заказ отменен',
          cancellationPolicy: 'Политика отмены'
        },

        // Home page specific
        home: {
          heroBadge: '✨ Новый AI-оптимизированный опыт покупок',
          heroTitle: 'Откройте для себя премиальные продукты',
          heroSubtitle: 'Покупайте с уверенностью, используя наши AI-рекомендации и персонализированный опыт покупок',
          shopNow: 'Купить сейчас',
          viewAll: 'Посмотреть все',
          freeShipping: 'Бесплатная доставка',
          freeShippingDesc: 'Бесплатная доставка на заказы от 50 долларов',
          securePayment: 'Безопасная оплата',
          securePaymentDesc: '256-bit SSL шифрование',
          easyReturns: 'Легкий возврат',
          easyReturnsDesc: '30-дневная политика возврата',
          categoriesTitle: 'Покупать по категориям',
          categoriesSubtitle: 'Исследуйте наш широкий ассортимент премиальных продуктов',
          featuredProducts: 'Рекомендуемые продукты',
          featuredProductsDesc: 'Откройте для себя наш тщательно отобранный выбор премиальных продуктов',
          aiRecommendations: 'Персонализированные AI-рекомендации',
          aiRecommendationsDesc: 'Получите персонализированные рекомендации по продуктам на основе ваших предпочтений',
          aiOptimizationTitle: 'AI-оптимизация',
          aiOptimizationDesc: 'Наш ИИ непрерывно оптимизирует карточки продуктов, генерирует SEO-оптимизированный контент и обеспечивает максимальную видимость на поисковых системах',
          averageSeoScore: 'Средний SEO рейтинг',
          seoScoreDesc: 'SEO-оптимизированные описания продуктов и мета-теги для лучших рейтингов поиска',
          aiGeneratedCollections: 'AI-сгенерированные коллекции',
          aiCollectionsDesc: 'Умные группировки продуктов на основе поведения клиентов и тенденций',
          seoMonitoring: 'SEO мониторинг',
          seoMonitoringDesc: 'Непрерывное отслеживание производительности и предложения по оптимизации',
          ctaTitle: 'Готовы к умным покупкам?',
          ctaSubtitle: 'Присоединяйтесь к тысячам довольных клиентов, которые доверяют нашей AI-платформе для своих потребностей в покупках.',
          startShopping: 'Начать покупки',
          learnMore: 'Узнать больше'
        }
      }
    );
  }
}

// Export singleton instance
const russianProvider = new RussianLanguageProvider();
export default russianProvider;