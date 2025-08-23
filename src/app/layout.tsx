import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { CartProvider } from "@/hooks/useCart";
import { AdvancedCartProvider } from "@/hooks/useAdvancedCart";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { CartAbandonmentRecovery } from "@/components/CartAbandonmentRecovery";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageAttributes } from "@/components/LanguageAttributes";
import { ChatWidget } from "@/components/ChatWidget";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { initializeChunkedI18n } from "@/lib/i18n-chunked";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aramac Branfing - Premium Ecommerce Platform",
  description: "Discover premium products at Aramac Branfing - Your trusted source for quality goods with exceptional service",
  keywords: ["ecommerce", "aramac branfing", "online store", "premium products", "quality goods"],
  openGraph: {
    type: "website",
    title: "Aramac Branfing - Premium Ecommerce Platform",
    description: "Discover premium products at Aramac Branfing - Your trusted source for quality goods with exceptional service",
    url: "/",
    siteName: "Aramac Branfing",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize the i18n system
  await initializeChunkedI18n();

  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {process.env.SKIP_AUTH === 'true' ? (
            <ConvexClientProvider>
              <LanguageProvider>
                <LanguageAttributes />
                <CurrencyProvider>
                  <CartProvider>
                    <AdvancedCartProvider>
                      {children}
                      <ChatWidget />
                      <ExitIntentPopup isEnabled={true} />
                      <CartAbandonmentRecovery isEnabled={true} />
                      <Toaster position="top-right" richColors />
                    </AdvancedCartProvider>
                  </CartProvider>
                </CurrencyProvider>
              </LanguageProvider>
            </ConvexClientProvider>
          ) : (
            <ClerkProvider>
              <ConvexClientProvider>
                <LanguageProvider>
                  <LanguageAttributes />
                  <CurrencyProvider>
                    <CartProvider>
                      <AdvancedCartProvider>
                        {children}
                        <ChatWidget />
                        <ExitIntentPopup isEnabled={true} />
                        <CartAbandonmentRecovery isEnabled={true} />
                        <Toaster position="top-right" richColors />
                      </AdvancedCartProvider>
                    </CartProvider>
                  </CurrencyProvider>
                </LanguageProvider>
              </ConvexClientProvider>
            </ClerkProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
