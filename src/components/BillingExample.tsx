/**
 * @fileoverview Billing system usage examples
 * @description Demonstrates how to integrate billing features into your application
 * @author AI Agent Generated
 * @version 1.0.0
 */

'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PaymentGated from './PaymentGated';
import CustomClerkPricing from './CustomClerkPricing';
import {
  Crown,
  Star,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  ShoppingCart,
  Database
} from 'lucide-react';

/**
 * Main billing dashboard component
 * Shows current plan, usage, and upgrade options
 */
export default function BillingExample() {
  const { user } = useUser();
  const [billingData, setBillingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user]);

  const fetchBillingData = async () => {
    try {
      const response = await fetch('/api/billing/subscription');
      if (response.ok) {
        const data = await response.json();
        setBillingData(data);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading billing information...</div>;
  }

  if (!billingData) {
    return (
      <div className="p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to load billing information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Billing Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your subscription and track usage
        </p>
      </div>

      {/* Current Plan Overview */}
      <CurrentPlanCard billingData={billingData} />

      {/* Usage Statistics */}
      <UsageOverview billingData={billingData} />

      {/* Premium Features Demo */}
      <PremiumFeaturesDemo />

      {/* Billing Actions */}
      <BillingActions
        billingData={billingData}
        onShowPricing={() => setShowPricing(true)}
      />

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowPricing(false)}
                >
                  Close
                </Button>
              </div>
              <CustomClerkPricing />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Current plan information card
 */
function CurrentPlanCard({ billingData }: { billingData: any }) {
  const getPlanIcon = () => {
    switch (billingData.planId) {
      case 'premium_plan':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 'basic_plan':
        return <Star className="w-6 h-6 text-blue-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
  };

  const getPlanBadgeColor = () => {
    switch (billingData.planId) {
      case 'premium_plan':
        return 'bg-yellow-100 text-yellow-800';
      case 'basic_plan':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getPlanIcon()}
            <div>
              <CardTitle>{billingData.planName}</CardTitle>
              <CardDescription>
                Plan actual • Estado: {billingData.status}
              </CardDescription>
            </div>
          </div>
          <Badge className={getPlanBadgeColor()}>
            {billingData.planId === 'premium_plan' ? 'Premium' :
             billingData.planId === 'basic_plan' ? 'Básico' : 'Gratuito'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Características incluidas:</p>
            <ul className="mt-2 space-y-1">
              {billingData.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {feature.replace('_', ' ')}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Límites del plan:</p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Productos:</span>
                <span>{billingData.limits.products === -1 ? 'Ilimitados' : billingData.limits.products}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pedidos:</span>
                <span>{billingData.limits.orders === -1 ? 'Ilimitados' : billingData.limits.orders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Almacenamiento:</span>
                <span>{billingData.limits.storage}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Usage statistics overview
 */
function UsageOverview({ billingData }: { billingData: any }) {
  // Mock usage data - in real app, fetch from API
  const [usage] = useState({
    products: { current: 5, limit: billingData.limits.products },
    orders: { current: 25, limit: billingData.limits.orders },
    storage: { current: 0.5, limit: 1 }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Uso del Plan
        </CardTitle>
        <CardDescription>
          Seguimiento del uso de recursos de este mes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Products Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">Productos</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {usage.products.current} / {usage.products.limit === -1 ? '∞' : usage.products.limit}
            </span>
          </div>
          {usage.products.limit !== -1 && (
            <Progress
              value={(usage.products.current / usage.products.limit) * 100}
              className="h-2"
            />
          )}
        </div>

        {/* Orders Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Pedidos</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {usage.orders.current} / {usage.orders.limit === -1 ? '∞' : usage.orders.limit}
            </span>
          </div>
          {usage.orders.limit !== -1 && (
            <Progress
              value={(usage.orders.current / usage.orders.limit) * 100}
              className="h-2"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Premium features demonstration
 */
function PremiumFeaturesDemo() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Funciones Premium</h2>

      {/* Basic Feature - Always Available */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Función Básica
          </CardTitle>
          <CardDescription>
            Esta función está disponible en todos los planes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gestión básica de productos, procesamientos de pagos simples, etc.
          </p>
        </CardContent>
      </Card>

      {/* Premium Feature - Gated */}
      <PaymentGated
        feature="análisis avanzado de datos"
        plan="premium"
        fallback={
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Crown className="w-5 h-5" />
                Análisis Avanzado (Premium)
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Desbloquea reportes detallados y análisis de tendencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 mb-4">
                Esta función requiere un plan Premium para acceder a:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Reportes automáticos</li>
                <li>• Análisis de tendencias</li>
                <li>• Métricas avanzadas</li>
              </ul>
            </CardContent>
          </Card>
        }
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              Análisis Avanzado (Activado)
            </CardTitle>
            <CardDescription className="text-green-700">
              ¡Tienes acceso completo a análisis avanzados!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,234</div>
                <div className="text-sm text-green-700">Visitas hoy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-green-700">Conversión</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$12,345</div>
                <div className="text-sm text-green-700">Ingresos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PaymentGated>
    </div>
  );
}

/**
 * Billing action buttons
 */
function BillingActions({ billingData, onShowPricing }: { billingData: any; onShowPricing: () => void }) {
  const handleCancelSubscription = async () => {
    if (confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) {
      try {
        const response = await fetch('/api/billing/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'cancel' })
        });

        if (response.ok) {
          alert('Suscripción cancelada exitosamente');
          window.location.reload();
        } else {
          alert('Error al cancelar la suscripción');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al cancelar la suscripción');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones de Facturación</CardTitle>
        <CardDescription>
          Gestiona tu suscripción y plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button onClick={onShowPricing} className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            {billingData.planId === 'free_user' ? 'Actualizar Plan' : 'Cambiar Plan'}
          </Button>

          {billingData.planId !== 'free_user' && (
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              className="flex items-center gap-2"
            >
              Cancelar Suscripción
            </Button>
          )}

          <Button variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Soporte
          </Button>
        </div>

        {billingData.cancelAtPeriodEnd && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Tu suscripción se cancelará al final del período actual.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}