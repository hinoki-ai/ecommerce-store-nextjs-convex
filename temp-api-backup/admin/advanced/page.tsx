import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Share2, 
  Smartphone, 
  Brain,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Gift,
  Target,
  Wifi,
  Bell
} from 'lucide-react';

export default function AdvancedFeaturesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funciones Avanzadas</h1>
          <p className="text-muted-foreground">
            Gestiona promociones, redes sociales, PWA y personalización AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            AI Habilitado
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Analytics Activo
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="promotions" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Promociones
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="pwa" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            PWA
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Personalización
          </TabsTrigger>
        </TabsList>

        {/* Promotions Tab */}
        <TabsContent value="promotions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Promotions Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promociones Activas</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +3 desde el mes pasado
                </p>
              </CardContent>
            </Card>

            {/* Total Savings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ahorros Generados</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">
                  +18% vs mes anterior
                </p>
              </CardContent>
            </Card>

            {/* Usage Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Uso</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% desde la semana pasada
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Promotions Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Promociones</CardTitle>
              <CardDescription>
                Crea, edita y monitorea promociones avanzadas con reglas inteligentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Motor de Promociones</h4>
                  <p className="text-sm text-muted-foreground">
                    Promociones automáticas, cupones y descuentos por volumen
                  </p>
                </div>
                <Button>Configurar</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Reglas de Negocio</h4>
                  <p className="text-sm text-muted-foreground">
                    Condiciones avanzadas y acciones personalizables
                  </p>
                </div>
                <Button variant="outline">Gestionar</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">A/B Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Prueba diferentes estrategias de promociones
                  </p>
                </div>
                <Button variant="outline">Ver Resultados</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comparticiones</CardTitle>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">
                  +12% desde la semana pasada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  +3.2% vs promedio industria
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2%</div>
                <p className="text-xs text-muted-foreground">
                  +0.8% desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integración de Redes Sociales</CardTitle>
              <CardDescription>
                Gestiona compartición social y contenido generado con AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">WhatsApp</span>
                  </div>
                  <span className="text-xs text-muted-foreground">89%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Facebook</span>
                  </div>
                  <span className="text-xs text-muted-foreground">67%</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm">Instagram</span>
                  </div>
                  <span className="text-xs text-muted-foreground">54%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Contenido AI</h4>
                  <p className="text-sm text-muted-foreground">
                    Genera posts optimizados para cada plataforma
                  </p>
                </div>
                <Button>Generar Contenido</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PWA Tab */}
        <TabsContent value="pwa" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Instalaciones PWA</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +23% desde el último mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Offline</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  Promedio diario
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Push Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  Tasa de apertura
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuración PWA</CardTitle>
              <CardDescription>
                Gestiona funciones de aplicación web progresiva y notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Service Worker</h4>
                  <p className="text-sm text-muted-foreground">
                    Caché inteligente y sincronización offline
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Activo</Badge>
                  <Button size="sm" variant="outline">Configurar</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones automáticas de pedidos y promociones
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Configurado</Badge>
                  <Button size="sm" variant="outline">Gestionar</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Instalación Prompts</h4>
                  <p className="text-sm text-muted-foreground">
                    Promociona la instalación de la app
                  </p>
                </div>
                <Button size="sm">Personalizar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Personalization Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Perfiles AI</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,623</div>
                <p className="text-xs text-muted-foreground">
                  Perfiles personalizados activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Precisión AI</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">
                  Precisión de recomendaciones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CTR Personalizado</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4%</div>
                <p className="text-xs text-muted-foreground">
                  +4.2% vs recomendaciones genéricas
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Motor de Personalización AI</CardTitle>
              <CardDescription>
                Configuración avanzada del sistema de recomendaciones inteligentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Algoritmo de Recomendaciones</h4>
                  <p className="text-sm text-muted-foreground">
                    Filtrado colaborativo + contenido + AI generativo
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">GPT-4 Optimizado</Badge>
                  <Button size="sm" variant="outline">Ajustar</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Tracking Comportamental</h4>
                  <p className="text-sm text-muted-foreground">
                    Análisis en tiempo real de patrones de usuario
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Activo</Badge>
                  <Button size="sm" variant="outline">Ver Datos</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">A/B Testing AI</h4>
                  <p className="text-sm text-muted-foreground">
                    Pruebas automáticas de diferentes estrategias
                  </p>
                </div>
                <Button size="sm">Configurar Experimentos</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">Segmentación Automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Grupos de usuarios generados por AI
                  </p>
                </div>
                <Button size="sm" variant="outline">Ver Segmentos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}