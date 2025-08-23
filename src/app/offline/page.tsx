'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Home, ShoppingCart, Heart } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-gray-500" />
          </div>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
            Sin Conexión a Internet
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              No hay conexión a internet disponible en este momento.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Puedes seguir navegando el contenido que ya has visitado.
            </p>
          </div>

          {/* Offline Actions */}
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de Nuevo
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/'}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Home className="w-4 h-4" />
                <span className="text-xs">Inicio</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/cart'}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">Carrito</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/wishlist'}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Heart className="w-4 h-4" />
                <span className="text-xs">Favoritos</span>
              </Button>
            </div>
          </div>

          {/* Offline Features */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Funciones Disponibles sin Internet:
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Ver productos visitados recientemente</li>
              <li>• Navegar tu carrito de compras</li>
              <li>• Revisar tu lista de deseos</li>
              <li>• Ver tus pedidos guardados</li>
            </ul>
          </div>

          {/* Connection Tips */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Consejos para Conectarse:
            </h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Verifica tu conexión WiFi o datos móviles</li>
              <li>• Prueba moverte a una zona con mejor señal</li>
              <li>• Reinicia tu router o dispositivo móvil</li>
              <li>• Contacta a tu proveedor de internet</li>
            </ul>
          </div>

          {/* PWA Information */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Esta aplicación funciona offline gracias a la tecnología PWA
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Tus datos se sincronizarán automáticamente cuando vuelvas online
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}