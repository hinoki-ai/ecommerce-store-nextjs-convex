/**
 * French Language Chunk
 * Complete language implementation for French (fr)
 */

import { BaseLanguageProvider } from '../providers/language-provider';

export class FrenchLanguageProvider extends BaseLanguageProvider {
  constructor() {
    super(
      'fr',
      {
        siteName: 'Boutique de Luxe en Ligne',
        description: 'Produits de luxe premium avec SEO optimisé par IA',
        keywords: ['luxe', 'premium', 'qualité', 'designer', 'mode', 'accessoires'],
        metaTags: {
          'og:type': 'website',
          'og:site_name': 'Boutique de Luxe en Ligne',
          'twitter:card': 'summary_large_image',
          'twitter:title': 'Boutique de Luxe en Ligne',
          'twitter:description': 'Produits de luxe premium avec SEO optimisé par IA',
        }
      },
      {
        // Navigation
        nav: {
          home: 'Accueil',
          products: 'Produits',
          categories: 'Catégories',
          collections: 'Collections',
          blog: 'Blog',
          about: 'À propos',
          contact: 'Contact',
          cart: 'Panier',
          wishlist: 'Liste de souhaits',
          account: 'Mon compte',
          search: 'Rechercher',
          signIn: 'Se connecter',
          signUp: 'S\'inscrire'
        },

        // Common UI elements
        common: {
          loading: 'Chargement...',
          error: 'Erreur',
          success: 'Succès',
          warning: 'Avertissement',
          info: 'Information',
          cancel: 'Annuler',
          confirm: 'Confirmer',
          save: 'Sauvegarder',
          delete: 'Supprimer',
          edit: 'Modifier',
          add: 'Ajouter',
          remove: 'Retirer',
          back: 'Retour',
          next: 'Suivant',
          previous: 'Précédent',
          close: 'Fermer',
          open: 'Ouvrir'
        },

        // Product related
        product: {
          price: 'Prix',
          originalPrice: 'Prix original',
          discount: 'Remise',
          inStock: 'En stock',
          outOfStock: 'Épuisé',
          addToCart: 'Ajouter au panier',
          buyNow: 'Acheter maintenant',
          description: 'Description',
          specifications: 'Spécifications',
          reviews: 'Avis',
          relatedProducts: 'Produits similaires',
          quantity: 'Quantité',
          size: 'Taille',
          color: 'Couleur',
          material: 'Matériau',
          brand: 'Marque',
          sku: 'SKU',
          availability: 'Disponibilité',
          notFound: 'Produit non trouvé',
          notFoundDesc: 'Le produit que vous cherchez n\'existe pas ou a été supprimé.',
          browseProducts: 'Parcourir les produits'
        },

        // Cart and checkout
        cart: {
          title: 'Panier d\'achats',
          empty: 'Votre panier est vide',
          emptyMessage: 'Il semble que vous n\'ayez encore rien ajouté à votre panier.',
          emptyAction: 'Commencer les achats',
          subtotal: 'Sous-total',
          tax: 'Taxes',
          shipping: 'Livraison',
          total: 'Total',
          checkout: 'Commander',
          continueShopping: 'Continuer les achats',
          removeItem: 'Retirer l\'article',
          updateQuantity: 'Mettre à jour la quantité',
          clearCart: 'Vider le panier',
          quantity: 'Quantité',
          price: 'Prix',
          totalPrice: 'Prix total',
          itemRemoved: 'Article retiré du panier',
          cartCleared: 'Panier vidé',
          quantityUpdated: 'Quantité mise à jour',
          failedToUpdate: 'Erreur lors de la mise à jour de la quantité',
          failedToRemove: 'Erreur lors de la suppression de l\'article',
          failedToClear: 'Erreur lors de la vidange du panier',
          loading: 'Chargement du panier...',
          items: 'articles',
          item: 'article',
          inCart: 'dans votre panier',
          each: 'chacun',
          orderSummary: 'Résumé de commande',
          free: 'Gratuit',
          whyShopWithUs: 'Pourquoi acheter chez nous ?',
          securePayment: 'Paiement sécurisé',
          sslEncryption: 'Chiffrement SSL 256 bits',
          freeShipping: 'Livraison gratuite',
          freeShippingDesc: 'Livraison gratuite sur les commandes de plus de 50€',
          easyReturns: 'Retours faciles',
          easyReturnsDesc: 'Politique de retour de 30 jours',
          searchProducts: 'Rechercher des produits...',
          allCategories: 'Toutes les catégories',
          sortBy: 'Trier par',
          newest: 'Plus récents',
          priceLow: 'Prix : Croissant',
          priceHigh: 'Prix : Décroissant',
          nameAZ: 'Nom : A à Z',
          filterByPrice: 'Filtrer par prix',
          filterByCategory: 'Filtrer par catégorie',
          showing: 'Affichage',
          of: 'sur',
          products: 'produits',
          noProductsFound: 'Aucun produit trouvé',
          tryDifferentSearch: 'Essayez d\'ajuster votre recherche ou vos filtres',
          clearFilters: 'Effacer tous les filtres',
          loadMore: 'Charger plus',
          filters: 'Filtres',
          priceRange: 'Plage de prix',
          activeFilters: 'Filtres actifs',
          success: {
            addedToCart: 'ajouté au panier'
          },
          forms: {
            placeholder: {
              search: 'Rechercher des produits...'
            }
          }
        },

        // User account
        account: {
          profile: 'Profil',
          orders: 'Commandes',
          addresses: 'Adresses',
          paymentMethods: 'Modes de paiement',
          settings: 'Paramètres',
          logout: 'Se déconnecter',
          login: 'Se connecter',
          register: 'S\'inscrire',
          forgotPassword: 'Mot de passe oublié?',
          email: 'E-mail',
          password: 'Mot de passe',
          firstName: 'Prénom',
          lastName: 'Nom',
          phone: 'Téléphone'
        },

        // SEO and content
        seo: {
          luxury: 'luxe',
          premium: 'premium',
          quality: 'qualité',
          designer: 'designer',
          fashion: 'mode',
          accessories: 'accessoires',
          beauty: 'beauté',
          home: 'maison',
          electronics: 'électronique'
        },

        // Hero and main content
        hero: {
          title: 'Bienvenue dans la Boutique de Luxe en Ligne',
          subtitle: 'Produits de luxe premium avec SEO optimisé par IA',
          newBadge: '✨ Nouvelle expérience d\'achat alimentée par IA',
          shopNow: 'Acheter maintenant',
          featuredProducts: 'Produits en vedette',
          exploreCategories: 'Explorer les catégories'
        },

        // Categories
        categories: {
          electronics: 'Électronique',
          clothing: 'Vêtements',
          homeGarden: 'Maison & Jardin',
          sports: 'Sports',
          beauty: 'Beauté',
          books: 'Livres',
          toys: 'Jouets',
          automotive: 'Automobile'
        },

        // Features/Benefits
        features: {
          freeShipping: 'Livraison gratuite',
          freeShippingDesc: 'Livraison gratuite sur les commandes de plus de 100€',
          securePayment: 'Paiement sécurisé',
          securePaymentDesc: 'Vos données de paiement sont en sécurité avec nous',
          easyReturns: 'Retours faciles',
          easyReturnsDesc: 'Politique de retour de 30 jours pour tous les articles',
          customerSupport: 'Support 24/7',
          customerSupportDesc: 'Obtenez de l\'aide quand vous en avez besoin'
        },

        // Collections and sections
        collections: 'Collections',
        blog: 'Blog',
        about: 'À propos',
        contact: 'Contact',

        // Product details
        productDetails: 'Détails du produit',
        specifications: 'Spécifications',
        reviews: 'Avis',
        relatedProducts: 'Produits similaires',
        customerReviews: 'Avis clients',
        writeReview: 'Écrire un avis',
        addToWishlist: 'Ajouter à la liste de souhaits',
        removeFromWishlist: 'Retirer de la liste de souhaits',

        // Cart and checkout
        checkout: 'Paiement',
        continueShopping: 'Continuer les achats',
        orderSummary: 'Résumé de commande',
        subtotal: 'Sous-total',
        tax: 'Taxes',
        shipping: 'Livraison',
        total: 'Total',
        applyCoupon: 'Appliquer le coupon',
        couponCode: 'Code de coupon',
        haveAccount: 'Vous avez un compte?',
        signIn: 'Se connecter',
        guestCheckout: 'Commande invité',
        billingAddress: 'Adresse de facturation',
        shippingAddress: 'Adresse de livraison',
        paymentMethod: 'Mode de paiement',
        placeOrder: 'Passer la commande',
        orderConfirmation: 'Confirmation de commande',
        thankYou: 'Merci pour votre commande!',
        orderNumber: 'Numéro de commande',

        // Footer
        footer: {
          company: 'Entreprise',
          customerService: 'Service client',
          followUs: 'Suivez-nous',
          newsletter: 'Newsletter',
          subscribe: 'S\'abonner',
          emailPlaceholder: 'Entrez votre email',
          allRightsReserved: 'Tous droits réservés',
          privacyPolicy: 'Politique de confidentialité',
          termsOfService: 'Conditions d\'utilisation',
          shippingInfo: 'Informations de livraison',
          returnPolicy: 'Politique de retour',
          faq: 'FAQ',
          quickLinks: 'Liens rapides',
          contactInfo: 'Informations de contact',
          helpCenter: 'Centre d\'aide',
          returnsExchanges: 'Retours & Échanges',
          sizeGuide: 'Guide des tailles'
        },

        // Additional form elements
        forms: {
          firstName: 'Prénom',
          lastName: 'Nom',
          email: 'E-mail',
          phone: 'Téléphone',
          address: 'Adresse',
          city: 'Ville',
          state: 'Département',
          zipCode: 'Code postal',
          country: 'Pays',
          password: 'Mot de passe',
          confirmPassword: 'Confirmer le mot de passe',
          createAccount: 'Créer un compte',
          rememberMe: 'Se souvenir de moi',
          forgotPassword: 'Mot de passe oublié?',
          resetPassword: 'Réinitialiser le mot de passe',
          login: 'Se connecter',
          register: 'S\'inscrire',
          newsletterSignup: 'S\'inscrire à notre newsletter',
          agreeTerms: 'J\'accepte les conditions d\'utilisation',
          subscribe: 'S\'abonner',
          placeholder: {
            email: 'votre@email.com',
            name: 'Votre nom',
            message: 'Votre message ici...',
            search: 'Rechercher des produits...'
          }
        },

        // Additional error and success messages
        errors: {
          requiredField: 'Ce champ est requis',
          invalidEmail: 'Veuillez entrer une adresse email valide',
          passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
          passwordsNotMatch: 'Les mots de passe ne correspondent pas',
          invalidPhone: 'Veuillez entrer un numéro de téléphone valide',
          invalidZipCode: 'Veuillez entrer un code postal valide',
          couponInvalid: 'Code de coupon invalide',
          outOfStock: 'Cet article est en rupture de stock',
          minimumOrder: 'Montant minimum de commande de 10€',
          paymentFailed: 'Paiement échoué. Veuillez réessayer',
          shippingAddressRequired: 'Adresse de livraison requise',
          billingAddressRequired: 'Adresse de facturation requise',
          invalidCardNumber: 'Veuillez entrer un numéro de carte valide',
          invalidExpiryDate: 'Veuillez entrer une date d\'expiration valide',
          invalidCvv: 'Veuillez entrer un CVV valide',
          insufficientStock: 'Stock insuffisant pour certains articles',
          maximumQuantity: 'Quantité maximale dépassée',
          duplicateEmail: 'Cet email est déjà enregistré',
          accountNotFound: 'Compte non trouvé',
          invalidCredentials: 'Email ou mot de passe invalide',
          accountLocked: 'Compte temporairement verrouillé',
          sessionExpired: 'Votre session a expiré. Veuillez vous reconnecter',
          networkError: 'Erreur réseau. Veuillez vérifier votre connexion',
          serverError: 'Erreur serveur. Veuillez réessayer plus tard',
          orderNotFound: 'Commande non trouvée',
          paymentDeclined: 'Paiement refusé',
          addressNotFound: 'Adresse non trouvée',
          productNotFound: 'Produit non trouvé',
          categoryNotFound: 'Catégorie non trouvée',
          insufficientPermissions: 'Permissions insuffisantes',
          rateLimitExceeded: 'Trop de demandes. Veuillez réessayer plus tard'
        },

        success: {
          couponApplied: 'Coupon appliqué avec succès',
          accountCreated: 'Compte créé avec succès',
          passwordReset: 'Email de réinitialisation de mot de passe envoyé',
          reviewSubmitted: 'Avis soumis avec succès',
          newsletterSubscribed: 'Abonnement à la newsletter réussi',
          orderPlaced: 'Commande passée avec succès',
          paymentProcessed: 'Paiement traité avec succès',
          addressSaved: 'Adresse sauvegardée avec succès',
          profileUpdated: 'Profil mis à jour avec succès',
          passwordChanged: 'Mot de passe changé avec succès',
          wishlistUpdated: 'Liste de souhaits mise à jour avec succès',
          itemAddedToCart: 'Article ajouté au panier avec succès',
          itemRemovedFromCart: 'Article retiré du panier avec succès',
          subscriptionUpdated: 'Abonnement mis à jour avec succès',
          notificationSettingsUpdated: 'Paramètres de notification mis à jour avec succès',
          languageChanged: 'Langue changée avec succès',
          currencyChanged: 'Devise changée avec succès',
          loginSuccessful: 'Connexion réussie',
          logoutSuccessful: 'Déconnexion réussie',
          registrationSuccessful: 'Inscription réussie',
          emailVerified: 'Email vérifié avec succès',
          orderCancelled: 'Commande annulée avec succès',
          refundProcessed: 'Remboursement traité avec succès'
        },

        // Currency and pricing
        currency: {
          symbol: '€',
          code: 'EUR',
          format: 'fr-FR'
        },

        // Regional variations for France
        regional: {
          france: {
            currencySymbol: '€',
            currencyFormat: 'fr-FR',
            countryName: 'France',
            regionName: 'Europe',
            postalCodeName: 'Code postal',
            stateName: 'Département',
            phoneCode: '+33',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h'
          },
          commonTerms: {
            neighborhood: 'Quartier',
            municipality: 'Commune',
            province: 'Province',
            department: 'Département',
            district: 'Arrondissement'
          }
        },

        // Payment methods common in France
        paymentMethods: {
          creditCard: 'Carte de crédit',
          debitCard: 'Carte de débit',
          bankTransfer: 'Virement bancaire',
          cashOnDelivery: 'Paiement à la livraison',
          digitalWallet: 'Portefeuille numérique',
          installments: 'Paiements échelonnés',
          onePayment: 'Paiement unique',
          twoPayments: '2 versements',
          threePayments: '3 versements',
          sixPayments: '6 versements',
          twelvePayments: '12 versements'
        },

        // Date and time
        date: {
          today: 'Aujourd\'hui',
          yesterday: 'Hier',
          tomorrow: 'Demain',
          days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
          months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        },



        // Product specific
        productCard: {
          new: 'Nouveau',
          fresh: 'Frais',
          popular: 'Populaire',
          noImage: 'Pas d\'image',
          adding: 'Ajout en cours...',
          viewDetails: 'Voir les détails',
          seoScore: 'Score SEO'
        },

        // Product detail page
        productDetail: {
          seoOptimizationScore: 'Score d\'optimisation SEO',
          seoOptimizationDesc: 'Optimisation alimentée par IA pour une meilleure visibilité',
          excellent: 'Excellent',
          good: 'Bon',
          needsImprovement: 'À améliorer',
          description: 'Description',
          specifications: 'Spécifications',
          reviews: 'Avis',
          technicalSpecifications: 'Spécifications techniques',
          dimensions: 'Dimensions',
          weight: 'Poids',
          material: 'Matériau',
          additionalFeatures: 'Fonctionnalités supplémentaires',
          premiumQualityMaterials: 'Matériaux de qualité premium',
          manufacturerWarranty: 'Garantie constructeur',
          freeShipping: 'Livraison gratuite',
          premiumQuality: 'Qualité Premium'
        },

        // Admin functionality
        admin: {
          dashboard: 'Tableau de bord',
          analytics: 'Analytique',
          orders: 'Commandes',
          customers: 'Clients',
          products: 'Produits',
          settings: 'Paramètres',
          content: 'Contenu',
          seo: 'SEO',
          users: 'Utilisateurs',
          revenue: 'Revenus',
          inventory: 'Inventaire',
          reports: 'Rapports',
          notifications: 'Notifications',
          promotions: 'Promotions',
          affiliates: 'Affiliés',
          advanced: 'Avancé',
          orderManagement: 'Gestion des commandes',
          searchOrders: 'Rechercher des commandes',
          filterByStatus: 'Filtrer par statut',
          orderNumber: 'Commande N°',
          customerName: 'Nom du client',
          orderDate: 'Date de commande',
          orderStatus: 'Statut de la commande',
          orderTotal: 'Total de la commande',
          viewOrder: 'Voir la commande',
          editOrder: 'Modifier la commande',
          shipOrder: 'Expédier la commande',
          cancelOrder: 'Annuler la commande',
          processRefund: 'Traiter le remboursement',
          customerService: 'Service client',
          supportTickets: 'Tickets de support',
          reviews: 'Avis',
          analyticsOverview: 'Aperçu analytique',
          salesPerformance: 'Performance des ventes',
          customerInsights: 'Informations clients',
          productPerformance: 'Performance des produits',
          seoAnalytics: 'Analytique SEO',
          trafficSources: 'Sources de trafic',
          conversionRate: 'Taux de conversion',
          averageOrderValue: 'Valeur moyenne des commandes',
          customerRetention: 'Rétention client',
          inventoryManagement: 'Gestion des stocks',
          stockLevels: 'Niveaux de stock',
          lowStockAlerts: 'Alertes de stock faible',
          outOfStockItems: 'Articles en rupture de stock',
          reorderPoints: 'Points de réapprovisionnement',
          supplierManagement: 'Gestion des fournisseurs',
          bulkOperations: 'Opérations en masse',
          importExport: 'Import/Export',
          systemSettings: 'Paramètres système',
          paymentSettings: 'Paramètres de paiement',
          shippingSettings: 'Paramètres de livraison',
          taxSettings: 'Paramètres fiscaux',
          emailSettings: 'Paramètres email',
          apiSettings: 'Paramètres API',
          securitySettings: 'Paramètres de sécurité',
          backupRestore: 'Sauvegarde & Restauration',
          systemMaintenance: 'Maintenance système'
        },

        // Order statuses
        orderStatus: {
          pending: 'En attente',
          processing: 'En traitement',
          confirmed: 'Confirmé',
          shipped: 'Expédié',
          delivered: 'Livré',
          cancelled: 'Annulé',
          refunded: 'Remboursé',
          onHold: 'En attente',
          backordered: 'En réapprovisionnement',
          returned: 'Retourné',
          failed: 'Échoué'
        },

        // Tracking and shipping
        tracking: {
          trackingNumber: 'Numéro de suivi',
          carrier: 'Transporteur',
          estimatedDelivery: 'Livraison estimée',
          shippingMethod: 'Mode de livraison',
          trackingHistory: 'Historique de suivi',
          shipped: 'Expédié',
          inTransit: 'En transit',
          outForDelivery: 'En cours de livraison',
          delivered: 'Livré',
          deliveryAttempted: 'Livraison tentée',
          awaitingPickup: 'En attente de retrait',
          returnedToSender: 'Retourné à l\'expéditeur'
        },

        // Refund and cancellation
        refund: {
          refundRequest: 'Demande de remboursement',
          refundStatus: 'Statut du remboursement',
          refundAmount: 'Montant du remboursement',
          refundReason: 'Raison du remboursement',
          processingRefund: 'Remboursement en traitement',
          refundCompleted: 'Remboursement terminé',
          refundDenied: 'Remboursement refusé',
          partialRefund: 'Remboursement partiel',
          fullRefund: 'Remboursement complet',
          cancelOrder: 'Annuler la commande',
          cancellationReason: 'Raison de l\'annulation',
          orderCancelled: 'Commande annulée',
          cancellationPolicy: 'Politique d\'annulation'
        },

        // Home page specific
        home: {
          heroBadge: '✨ Nouvelle expérience d\'achat alimentée par IA',
          heroTitle: 'Découvrez des produits premium',
          heroSubtitle: 'Achetez en toute confiance en utilisant nos recommandations alimentées par IA et notre expérience d\'achat personnalisée',
          shopNow: 'Acheter maintenant',
          viewAll: 'Voir tout',
          freeShipping: 'Livraison gratuite',
          freeShippingDesc: 'Livraison gratuite sur les commandes de plus de 50€',
          securePayment: 'Paiement sécurisé',
          securePaymentDesc: 'Chiffrement SSL 256-bit',
          easyReturns: 'Retours faciles',
          easyReturnsDesc: 'Politique de retour de 30 jours',
          categoriesTitle: 'Acheter par catégorie',
          categoriesSubtitle: 'Explorez notre large gamme de produits premium',
          featuredProducts: 'Produits en vedette',
          featuredProductsDesc: 'Découvrez notre sélection soignée de produits premium',
          aiRecommendations: 'Recommandations personnalisées IA',
          aiRecommendationsDesc: 'Obtenez des recommandations de produits personnalisées basées sur vos préférences',
          aiOptimizationTitle: 'Optimisation alimentée par IA',
          aiOptimizationDesc: 'Notre IA optimise continuellement les fiches produit, génère du contenu optimisé SEO et assure une visibilité maximale sur les moteurs de recherche',
          averageSeoScore: 'Score SEO moyen',
          seoScoreDesc: 'Descriptions de produits et balises meta optimisées SEO pour de meilleurs classements de recherche',
          aiGeneratedCollections: 'Collections générées par IA',
          aiCollectionsDesc: 'Regroupements de produits intelligents basés sur le comportement des clients et les tendances',
          seoMonitoring: 'Surveillance SEO',
          seoMonitoringDesc: 'Suivi continu des performances et suggestions d\'optimisation',
          ctaTitle: 'Prêt pour un achat intelligent?',
          ctaSubtitle: 'Rejoignez des milliers de clients satisfaits qui font confiance à notre plateforme alimentée par IA pour leurs besoins d\'achat.',
          startShopping: 'Commencer les achats',
          learnMore: 'En savoir plus'
        }
      }
    );
  }
}

// Export singleton instance
const frenchProvider = new FrenchLanguageProvider();
export default frenchProvider;