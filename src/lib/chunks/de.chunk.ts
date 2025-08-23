/**
 * German Language Chunk
 * Complete language implementation for German (de)
 */

import { BaseLanguageProvider } from '../providers/language-provider';

export class GermanLanguageProvider extends BaseLanguageProvider {
  constructor() {
    super(
      'de',
      {
        siteName: 'Luxus Online-Shop',
        description: 'Premium Luxusprodukte mit KI-optimiertem SEO',
        keywords: ['Luxus', 'Premium', 'Qualität', 'Designer', 'Mode', 'Accessoires'],
        metaTags: {
          'og:type': 'website',
          'og:site_name': 'Luxus Online-Shop',
          'twitter:card': 'summary_large_image',
          'twitter:title': 'Luxus Online-Shop',
          'twitter:description': 'Premium Luxusprodukte mit KI-optimiertem SEO',
        }
      },
      {
        // Navigation
        nav: {
          home: 'Startseite',
          products: 'Produkte',
          categories: 'Kategorien',
          collections: 'Kollektionen',
          blog: 'Blog',
          about: 'Über uns',
          contact: 'Kontakt',
          cart: 'Warenkorb',
          wishlist: 'Wunschliste',
          account: 'Mein Konto',
          search: 'Suchen',
          signIn: 'Anmelden',
          signUp: 'Registrieren'
        },

        // Common UI elements
        common: {
          loading: 'Laden...',
          error: 'Fehler',
          success: 'Erfolg',
          warning: 'Warnung',
          info: 'Information',
          cancel: 'Abbrechen',
          confirm: 'Bestätigen',
          save: 'Speichern',
          delete: 'Löschen',
          edit: 'Bearbeiten',
          add: 'Hinzufügen',
          remove: 'Entfernen',
          back: 'Zurück',
          next: 'Weiter',
          previous: 'Zurück',
          close: 'Schließen',
          open: 'Öffnen'
        },

        // Product related
        product: {
          price: 'Preis',
          originalPrice: 'Ursprünglicher Preis',
          discount: 'Rabatt',
          inStock: 'Auf Lager',
          outOfStock: 'Nicht verfügbar',
          addToCart: 'In den Warenkorb',
          buyNow: 'Jetzt kaufen',
          description: 'Beschreibung',
          specifications: 'Spezifikationen',
          reviews: 'Bewertungen',
          relatedProducts: 'Ähnliche Produkte',
          quantity: 'Menge',
          size: 'Größe',
          color: 'Farbe',
          material: 'Material',
          brand: 'Marke',
          sku: 'SKU',
          availability: 'Verfügbarkeit',
          notFound: 'Produkt nicht gefunden',
          notFoundDesc: 'Das gesuchte Produkt existiert nicht oder wurde entfernt.',
          browseProducts: 'Produkte durchsuchen'
        },

        // Cart and checkout
        cart: {
          title: 'Warenkorb',
          empty: 'Ihr Warenkorb ist leer',
          subtotal: 'Zwischensumme',
          tax: 'Steuern',
          shipping: 'Versand',
          total: 'Gesamt',
          checkout: 'Zur Kasse',
          continueShopping: 'Einkauf fortsetzen',
          removeItem: 'Artikel entfernen',
          updateQuantity: 'Menge aktualisieren'
        },

        // User account
        account: {
          profile: 'Profil',
          orders: 'Bestellungen',
          addresses: 'Adressen',
          paymentMethods: 'Zahlungsmethoden',
          settings: 'Einstellungen',
          logout: 'Abmelden',
          login: 'Anmelden',
          register: 'Registrieren',
          forgotPassword: 'Passwort vergessen?',
          email: 'E-Mail',
          password: 'Passwort',
          firstName: 'Vorname',
          lastName: 'Nachname',
          phone: 'Telefon'
        },

        // SEO and content
        seo: {
          luxury: 'luxus',
          premium: 'premium',
          quality: 'qualität',
          designer: 'designer',
          fashion: 'mode',
          accessories: 'accessoires',
          beauty: 'schönheit',
          home: 'heim',
          electronics: 'elektronik'
        },

        // Hero and main content
        hero: {
          title: 'Willkommen im Luxus Online-Shop',
          subtitle: 'Premium Luxusprodukte mit KI-optimiertem SEO',
          newBadge: '✨ Neue KI-gestützte Einkaufserfahrung',
          shopNow: 'Jetzt einkaufen',
          featuredProducts: 'Ausgewählte Produkte',
          exploreCategories: 'Kategorien erkunden'
        },

        // Categories
        categories: {
          electronics: 'Elektronik',
          clothing: 'Bekleidung',
          homeGarden: 'Haus & Garten',
          sports: 'Sport',
          beauty: 'Schönheit',
          books: 'Bücher',
          toys: 'Spielzeug',
          automotive: 'Automobil'
        },

        // Features/Benefits
        features: {
          freeShipping: 'Kostenloser Versand',
          freeShippingDesc: 'Kostenloser Versand bei Bestellungen über 100€',
          securePayment: 'Sichere Zahlung',
          securePaymentDesc: 'Ihre Zahlungsdaten sind bei uns sicher',
          easyReturns: 'Einfache Rückgaben',
          easyReturnsDesc: '30-tägige Rückgabefrist für alle Artikel',
          customerSupport: '24/7 Support',
          customerSupportDesc: 'Holen Sie sich Hilfe, wann immer Sie sie brauchen'
        },

        // Collections and sections
        collections: 'Kollektionen',
        blog: 'Blog',
        about: 'Über uns',
        contact: 'Kontakt',

        // Product details
        productDetails: 'Produktdetails',
        specifications: 'Spezifikationen',
        reviews: 'Bewertungen',
        relatedProducts: 'Ähnliche Produkte',
        customerReviews: 'Kundenbewertungen',
        writeReview: 'Bewertung schreiben',
        addToWishlist: 'Zur Wunschliste hinzufügen',
        removeFromWishlist: 'Von Wunschliste entfernen',

        // Cart and checkout
        checkout: 'Kasse',
        continueShopping: 'Einkauf fortsetzen',
        orderSummary: 'Bestellübersicht',
        subtotal: 'Zwischensumme',
        tax: 'Steuern',
        shipping: 'Versand',
        total: 'Gesamt',
        applyCoupon: 'Gutschein anwenden',
        couponCode: 'Gutscheincode',
        haveAccount: 'Haben Sie ein Konto?',
        signIn: 'Anmelden',
        guestCheckout: 'Gastbestellung',
        billingAddress: 'Rechnungsadresse',
        shippingAddress: 'Lieferadresse',
        paymentMethod: 'Zahlungsmethode',
        placeOrder: 'Bestellung aufgeben',
        orderConfirmation: 'Bestellbestätigung',
        thankYou: 'Vielen Dank für Ihre Bestellung!',
        orderNumber: 'Bestellnummer',

        // Footer
        footer: {
          company: 'Unternehmen',
          customerService: 'Kundenservice',
          followUs: 'Folgen Sie uns',
          newsletter: 'Newsletter',
          subscribe: 'Abonnieren',
          emailPlaceholder: 'Ihre E-Mail eingeben',
          allRightsReserved: 'Alle Rechte vorbehalten',
          privacyPolicy: 'Datenschutz',
          termsOfService: 'Nutzungsbedingungen',
          shippingInfo: 'Versandinformationen',
          returnPolicy: 'Rückgaberichtlinien',
          faq: 'FAQ'
        },

        // Additional form elements
        forms: {
          firstName: 'Vorname',
          lastName: 'Nachname',
          email: 'E-Mail',
          phone: 'Telefon',
          address: 'Adresse',
          city: 'Stadt',
          state: 'Bundesland',
          zipCode: 'PLZ',
          country: 'Land',
          password: 'Passwort',
          confirmPassword: 'Passwort bestätigen',
          createAccount: 'Konto erstellen',
          rememberMe: 'Angemeldet bleiben',
          forgotPassword: 'Passwort vergessen?',
          resetPassword: 'Passwort zurücksetzen',
          login: 'Anmelden',
          register: 'Registrieren',
          newsletterSignup: 'Für unseren Newsletter anmelden',
          agreeTerms: 'Ich stimme den Nutzungsbedingungen zu',
          subscribe: 'Abonnieren',
          placeholder: {
            email: 'ihre@email.com',
            name: 'Ihr Name',
            message: 'Ihre Nachricht hier...',
            search: 'Produkte suchen...'
          }
        },

        // Additional error and success messages
        errors: {
          requiredField: 'Dieses Feld ist erforderlich',
          invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
          passwordTooShort: 'Passwort muss mindestens 8 Zeichen lang sein',
          passwordsNotMatch: 'Passwörter stimmen nicht überein',
          invalidPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
          invalidZipCode: 'Bitte geben Sie eine gültige PLZ ein',
          couponInvalid: 'Ungültiger Gutscheincode',
          outOfStock: 'Dieser Artikel ist nicht auf Lager',
          minimumOrder: 'Mindestbestellwert beträgt 10€',
          paymentFailed: 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut',
          shippingAddressRequired: 'Lieferadresse ist erforderlich',
          billingAddressRequired: 'Rechnungsadresse ist erforderlich',
          invalidCardNumber: 'Bitte geben Sie eine gültige Kartennummer ein',
          invalidExpiryDate: 'Bitte geben Sie ein gültiges Ablaufdatum ein',
          invalidCvv: 'Bitte geben Sie einen gültigen CVV ein',
          insufficientStock: 'Nicht ausreichender Lagerbestand für einige Artikel',
          maximumQuantity: 'Maximale Menge überschritten',
          duplicateEmail: 'Diese E-Mail ist bereits registriert',
          accountNotFound: 'Konto nicht gefunden',
          invalidCredentials: 'Ungültige E-Mail oder Passwort',
          accountLocked: 'Konto ist vorübergehend gesperrt',
          sessionExpired: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an',
          networkError: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung',
          serverError: 'Serverfehler. Bitte versuchen Sie es später erneut',
          orderNotFound: 'Bestellung nicht gefunden',
          paymentDeclined: 'Zahlung wurde abgelehnt',
          addressNotFound: 'Adresse nicht gefunden',
          productNotFound: 'Produkt nicht gefunden',
          categoryNotFound: 'Kategorie nicht gefunden',
          insufficientPermissions: 'Unzureichende Berechtigungen',
          rateLimitExceeded: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut'
        },

        success: {
          couponApplied: 'Gutschein erfolgreich angewendet',
          accountCreated: 'Konto erfolgreich erstellt',
          passwordReset: 'Passwort-Zurücksetzungs-E-Mail versendet',
          reviewSubmitted: 'Bewertung erfolgreich übermittelt',
          newsletterSubscribed: 'Erfolgreich für Newsletter angemeldet',
          orderPlaced: 'Bestellung erfolgreich aufgegeben',
          paymentProcessed: 'Zahlung erfolgreich verarbeitet',
          addressSaved: 'Adresse erfolgreich gespeichert',
          profileUpdated: 'Profil erfolgreich aktualisiert',
          passwordChanged: 'Passwort erfolgreich geändert',
          wishlistUpdated: 'Wunschliste erfolgreich aktualisiert',
          itemAddedToCart: 'Artikel erfolgreich zum Warenkorb hinzugefügt',
          itemRemovedFromCart: 'Artikel erfolgreich aus Warenkorb entfernt',
          subscriptionUpdated: 'Abonnement erfolgreich aktualisiert',
          notificationSettingsUpdated: 'Benachrichtigungseinstellungen erfolgreich aktualisiert',
          languageChanged: 'Sprache erfolgreich geändert',
          currencyChanged: 'Währung erfolgreich geändert',
          loginSuccessful: 'Anmeldung erfolgreich',
          logoutSuccessful: 'Abmeldung erfolgreich',
          registrationSuccessful: 'Registrierung erfolgreich',
          emailVerified: 'E-Mail erfolgreich verifiziert',
          orderCancelled: 'Bestellung erfolgreich storniert',
          refundProcessed: 'Rückerstattung erfolgreich verarbeitet'
        },

        // Currency and pricing
        currency: {
          symbol: '€',
          code: 'EUR',
          format: 'de-DE'
        },

        // Regional variations for Germany
        regional: {
          germany: {
            currencySymbol: '€',
            currencyFormat: 'de-DE',
            countryName: 'Deutschland',
            regionName: 'Europa',
            postalCodeName: 'PLZ',
            stateName: 'Bundesland',
            phoneCode: '+49',
            dateFormat: 'DD.MM.YYYY',
            timeFormat: '24h'
          },
          commonTerms: {
            neighborhood: 'Stadtteil',
            municipality: 'Gemeinde',
            province: 'Bundesland',
            department: 'Abteilung',
            district: 'Bezirk'
          }
        },

        // Payment methods common in Germany
        paymentMethods: {
          creditCard: 'Kreditkarte',
          debitCard: 'EC-Karte',
          bankTransfer: 'Banküberweisung',
          cashOnDelivery: 'Nachnahme',
          digitalWallet: 'Digitales Portemonnaie',
          installments: 'Ratenzahlung',
          onePayment: 'Einmalzahlung',
          twoPayments: '2 Raten',
          threePayments: '3 Raten',
          sixPayments: '6 Raten',
          twelvePayments: '12 Raten'
        },

        // Date and time
        date: {
          today: 'Heute',
          yesterday: 'Gestern',
          tomorrow: 'Morgen',
          days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
          months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
        },

        // Footer specific
        footer: {
          quickLinks: 'Schnellzugriff',
          customerService: 'Kundenservice',
          contactInfo: 'Kontaktinformationen',
          helpCenter: 'Hilfecenter',
          shippingInfo: 'Versandinformationen',
          returnsExchanges: 'Rückgaben & Umtausch',
          sizeGuide: 'Größenberatung',
          privacyPolicy: 'Datenschutz',
          termsOfService: 'Nutzungsbedingungen',
          cookiePolicy: 'Cookie-Richtlinie',
          allRightsReserved: 'Alle Rechte vorbehalten.',
          address: 'Musterstraße 123, Stadt, Land',
          phone: '+49 (30) 123-4567',
          email: 'support@luxusshop.de'
        },

        // Product specific
        productCard: {
          new: 'Neu',
          fresh: 'Frisch',
          popular: 'Beliebt',
          noImage: 'Kein Bild',
          adding: 'Hinzufügen...',
          viewDetails: 'Details anzeigen',
          seoScore: 'SEO-Bewertung'
        },

        // Product detail page
        productDetail: {
          seoOptimizationScore: 'SEO-Optimierungsbewertung',
          seoOptimizationDesc: 'KI-gestützte Optimierung für bessere Sichtbarkeit',
          excellent: 'Ausgezeichnet',
          good: 'Gut',
          needsImprovement: 'Verbesserungsbedarf',
          description: 'Beschreibung',
          specifications: 'Spezifikationen',
          reviews: 'Bewertungen',
          technicalSpecifications: 'Technische Spezifikationen',
          dimensions: 'Abmessungen',
          weight: 'Gewicht',
          material: 'Material',
          additionalFeatures: 'Zusätzliche Funktionen',
          premiumQualityMaterials: 'Premium-Qualitätsmaterialien',
          manufacturerWarranty: 'Herstellergarantie',
          freeShipping: 'Kostenloser Versand',
          premiumQuality: 'Premium-Qualität'
        },

        // Admin functionality
        admin: {
          dashboard: 'Dashboard',
          analytics: 'Analytik',
          orders: 'Bestellungen',
          customers: 'Kunden',
          products: 'Produkte',
          settings: 'Einstellungen',
          content: 'Inhalt',
          seo: 'SEO',
          users: 'Benutzer',
          revenue: 'Einnahmen',
          inventory: 'Inventar',
          reports: 'Berichte',
          notifications: 'Benachrichtigungen',
          promotions: 'Aktionen',
          affiliates: 'Partner',
          advanced: 'Erweitert',
          orderManagement: 'Bestellverwaltung',
          searchOrders: 'Bestellungen suchen',
          filterByStatus: 'Nach Status filtern',
          orderNumber: 'Bestell-Nr.',
          customerName: 'Kundenname',
          orderDate: 'Bestelldatum',
          orderStatus: 'Bestellstatus',
          orderTotal: 'Bestellsumme',
          viewOrder: 'Bestellung anzeigen',
          editOrder: 'Bestellung bearbeiten',
          shipOrder: 'Bestellung versenden',
          cancelOrder: 'Bestellung stornieren',
          processRefund: 'Rückerstattung bearbeiten',
          customerService: 'Kundenservice',
          supportTickets: 'Support-Tickets',
          reviews: 'Bewertungen',
          analyticsOverview: 'Analytik-Übersicht',
          salesPerformance: 'Verkaufsleistung',
          customerInsights: 'Kundeneinblicke',
          productPerformance: 'Produktleistung',
          seoAnalytics: 'SEO-Analytik',
          trafficSources: 'Verkehrsquellen',
          conversionRate: 'Konversionsrate',
          averageOrderValue: 'Durchschnittlicher Bestellwert',
          customerRetention: 'Kundenbindung',
          inventoryManagement: 'Lagerverwaltung',
          stockLevels: 'Lagerbestände',
          lowStockAlerts: 'Niedrigbestand-Warnungen',
          outOfStockItems: 'Nicht verfügbare Artikel',
          reorderPoints: 'Nachbestellpunkte',
          supplierManagement: 'Lieferantenverwaltung',
          bulkOperations: 'Massenoperationen',
          importExport: 'Import/Export',
          systemSettings: 'Systemeinstellungen',
          paymentSettings: 'Zahlungseinstellungen',
          shippingSettings: 'Versandeinstellungen',
          taxSettings: 'Steuereinstellungen',
          emailSettings: 'E-Mail-Einstellungen',
          apiSettings: 'API-Einstellungen',
          securitySettings: 'Sicherheitseinstellungen',
          backupRestore: 'Sicherung & Wiederherstellung',
          systemMaintenance: 'Systemwartung'
        },

        // Order statuses
        orderStatus: {
          pending: 'Ausstehend',
          processing: 'In Bearbeitung',
          confirmed: 'Bestätigt',
          shipped: 'Versendet',
          delivered: 'Geliefert',
          cancelled: 'Storniert',
          refunded: 'Rückerstattet',
          onHold: 'In Wartestellung',
          backordered: 'Nachbestellt',
          returned: 'Zurückgegeben',
          failed: 'Fehlgeschlagen'
        },

        // Tracking and shipping
        tracking: {
          trackingNumber: 'Sendungsnummer',
          carrier: 'Versandunternehmen',
          estimatedDelivery: 'Voraussichtliche Lieferung',
          shippingMethod: 'Versandart',
          trackingHistory: 'Sendungsverlauf',
          shipped: 'Versendet',
          inTransit: 'Unterwegs',
          outForDelivery: 'Zur Auslieferung bereit',
          delivered: 'Geliefert',
          deliveryAttempted: 'Lieferung versucht',
          awaitingPickup: 'Wartet auf Abholung',
          returnedToSender: 'An Absender zurückgegeben'
        },

        // Refund and cancellation
        refund: {
          refundRequest: 'Rückerstattungsanfrage',
          refundStatus: 'Rückerstattungsstatus',
          refundAmount: 'Rückerstattungsbetrag',
          refundReason: 'Rückerstattungsgrund',
          processingRefund: 'Rückerstattung wird bearbeitet',
          refundCompleted: 'Rückerstattung abgeschlossen',
          refundDenied: 'Rückerstattung abgelehnt',
          partialRefund: 'Teilrückerstattung',
          fullRefund: 'Vollständige Rückerstattung',
          cancelOrder: 'Bestellung stornieren',
          cancellationReason: 'Stornierungsgrund',
          orderCancelled: 'Bestellung storniert',
          cancellationPolicy: 'Stornierungsrichtlinien'
        },

        // Home page specific
        home: {
          heroBadge: '✨ Neue KI-gestützte Einkaufserfahrung',
          heroTitle: 'Entdecken Sie Premium-Produkte',
          heroSubtitle: 'Einkaufen Sie mit Zuversicht unter Verwendung unserer KI-gestützten Empfehlungen und personalisierten Einkaufserfahrung',
          shopNow: 'Jetzt einkaufen',
          viewAll: 'Alle anzeigen',
          freeShipping: 'Kostenloser Versand',
          freeShippingDesc: 'Kostenloser Versand bei Bestellungen über 50€',
          securePayment: 'Sichere Zahlung',
          securePaymentDesc: '256-bit SSL-Verschlüsselung',
          easyReturns: 'Einfache Rückgaben',
          easyReturnsDesc: '30-tägige Rückgabefrist',
          categoriesTitle: 'Einkaufen nach Kategorie',
          categoriesSubtitle: 'Entdecken Sie unser breites Spektrum an Premium-Produkten',
          featuredProducts: 'Ausgewählte Produkte',
          featuredProductsDesc: 'Entdecken Sie unsere handverlesene Auswahl an Premium-Produkten',
          aiRecommendations: 'KI-Personalisierte Empfehlungen',
          aiRecommendationsDesc: 'Erhalten Sie personalisierte Produktempfehlungen basierend auf Ihren Vorlieben',
          aiOptimizationTitle: 'KI-gestützte Optimierung',
          aiOptimizationDesc: 'Unsere KI optimiert kontinuierlich Produktlisten, generiert SEO-freundliche Inhalte und stellt maximale Sichtbarkeit über Suchmaschinen sicher',
          averageSeoScore: 'Durchschnittliche SEO-Bewertung',
          seoScoreDesc: 'KI-optimierte Produktbeschreibungen und Meta-Tags für bessere Suchrankings',
          aiGeneratedCollections: 'KI-generierte Kollektionen',
          aiCollectionsDesc: 'Intelligente Produktgruppierungen basierend auf Kundenverhalten und Trends',
          seoMonitoring: 'SEO-Überwachung',
          seoMonitoringDesc: 'Kontinuierliche Leistungsverfolgung und Optimierungsvorschläge',
          ctaTitle: 'Bereit für intelligentes Einkaufen?',
          ctaSubtitle: 'Schließen Sie sich Tausenden von zufriedenen Kunden an, die unserer KI-gestützten Plattform für ihre Einkaufsbedürfnisse vertrauen.',
          startShopping: 'Einkauf beginnen',
          learnMore: 'Mehr erfahren'
        }
      }
    );
  }
}

// Export singleton instance
const germanProvider = new GermanLanguageProvider();
export default germanProvider;