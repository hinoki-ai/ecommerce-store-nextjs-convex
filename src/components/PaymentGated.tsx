import { Protect } from '@clerk/nextjs';
import { ReactNode } from 'react';
import CustomClerkPricing from './CustomClerkPricing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Star, Zap } from 'lucide-react';

interface PaymentGatedProps {
  children: ReactNode;
  feature?: string;
  plan?: 'basic' | 'premium';
  fallback?: ReactNode;
}

/**
 * PaymentGated component - Protects premium features with billing gates
 * Based on Minimarket's payment-gated pattern with enhanced UI
 */
export default function PaymentGated({
  children,
  feature = "esta función",
  plan = "premium",
  fallback
}: PaymentGatedProps) {
  const getPlanIcon = () => {
    switch (plan) {
      case 'premium':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'basic':
        return <Star className="w-5 h-5 text-blue-500" />;
      default:
        return <Zap className="w-5 h-5 text-green-500" />;
    }
  };

  const getPlanColor = () => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'basic':
        return 'bg-gradient-to-r from-blue-400 to-purple-500';
      default:
        return 'bg-gradient-to-r from-green-400 to-blue-500';
    }
  };

  const UpgradeCard = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className={`w-16 h-16 mx-auto rounded-full ${getPlanColor()} flex items-center justify-center`}>
          {getPlanIcon()}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">
            {feature} requiere un plan {plan}
          </CardTitle>
          <CardDescription className="text-base">
            Desbloquea {feature} y muchas más funcionalidades premium para hacer crecer tu negocio.
          </CardDescription>
        </div>
        <Badge variant="secondary" className="w-fit mx-auto">
          Plan {plan.charAt(0).toUpperCase() + plan.slice(1)} requerido
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-green-600">✓ Incluido en tu plan</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Funciones básicas de e-commerce</li>
              <li>• Hasta 10 productos (Gratuito)</li>
              <li>• Procesamiento de pagos básico</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-600">🔒 Requiere upgrade</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• {feature}</li>
              <li>• Productos ilimitados</li>
              <li>• Analíticas avanzadas</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <CustomClerkPricing />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ¿Tienes preguntas sobre los planes?
          </p>
          <Button variant="outline" size="sm">
            Contactar soporte
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (fallback) {
    return (
      <Protect
        condition={(has) => {
          if (plan === 'premium') {
            return !has({ plan: "free_user" });
          }
          return has({ plan: plan });
        }}
        fallback={fallback}
      >
        {children}
      </Protect>
    );
  }

  return (
    <Protect
      condition={(has) => {
        if (plan === 'premium') {
          return !has({ plan: "free_user" });
        }
        return has({ plan: plan });
      }}
      fallback={<UpgradeCard />}
    >
      {children}
    </Protect>
  );
}

/**
 * HOC for protecting entire components with billing gates
 */
export function withBillingGate<P extends object>(
  Component: React.ComponentType<P>,
  feature?: string,
  plan?: 'basic' | 'premium'
) {
  return function ProtectedComponent(props: P) {
    return (
      <PaymentGated feature={feature} plan={plan}>
        <Component {...props} />
      </PaymentGated>
    );
  };
}