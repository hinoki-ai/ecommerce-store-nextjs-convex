'use client'
import { PricingTable } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CustomClerkPricing() {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Planes de Suscripción</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tu negocio. Todos los planes incluyen
          funcionalidades básicas de e-commerce con diferentes niveles de características avanzadas.
        </p>
      </div>

      {/* Pricing Table */}
      <div className="max-w-6xl mx-auto">
        <PricingTable
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              pricingTableCardTitle: {
                fontSize: 20,
                fontWeight: 600,
              },
              pricingTableCardDescription: {
                fontSize: 14,
                color: 'hsl(var(--muted-foreground))'
              },
              pricingTableCardFee: {
                fontSize: 36,
                fontWeight: 800,
              },
              pricingTableCardCta: {
                fontWeight: 600,
                borderRadius: '8px',
              },
              pricingTable: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
              },
            },
          }}

          // Custom pricing table configuration
          table={{
            features: [
              {
                key: 'products',
                label: 'Productos ilimitados',
                plans: ['free', 'basic', 'premium'],
              },
              {
                key: 'analytics',
                label: 'Analíticas básicas',
                plans: ['free', 'basic', 'premium'],
              },
              {
                key: 'support',
                label: 'Soporte por email',
                plans: ['basic', 'premium'],
              },
              {
                key: 'advanced_analytics',
                label: 'Analíticas avanzadas',
                plans: ['premium'],
              },
              {
                key: 'bulk_operations',
                label: 'Operaciones masivas',
                plans: ['premium'],
              },
              {
                key: 'custom_domain',
                label: 'Dominio personalizado',
                plans: ['premium'],
              },
              {
                key: 'api_access',
                label: 'Acceso API completo',
                plans: ['premium'],
              },
            ],
          }}
        />
      </div>

      {/* Feature Comparison Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Gratuito
              <Badge variant="secondary">FREE</Badge>
            </CardTitle>
            <CardDescription>
              Perfecto para comenzar tu tienda en línea
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Hasta 10 productos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Tienda básica</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Procesamiento de pagos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Básico
              <Badge className="bg-primary">POPULAR</Badge>
            </CardTitle>
            <CardDescription>
              Ideal para pequeños negocios en crecimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Productos ilimitados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Analíticas avanzadas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Soporte prioritario</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Gestión de inventario</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Premium
              <Badge variant="outline">PRO</Badge>
            </CardTitle>
            <CardDescription>
              Para empresas que necesitan todo incluido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Todo lo del plan Básico</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Operaciones masivas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Dominio personalizado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>API completa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Soporte 24/7</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}