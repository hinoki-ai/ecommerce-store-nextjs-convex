import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { CartProvider } from "@/hooks/useCart";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageAttributes } from "@/components/LanguageAttributes";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import ConvexClientProvider from "@/components/ConvexClientProvider";

// Using system fonts to avoid build issues with Google Fonts
const geistSans = {
  variable: "--font-geist-sans"
};

const geistMono = {
  variable: "--font-geist-mono"
};

export const metadata: Metadata = {
  title: "ΛRΛMΛC Store - AI-Powered E-Commerce SaaS Platform",
  description: "Experience the future of e-commerce with ΛRΛMΛC Store - Advanced AI-driven retail solutions, intelligent inventory management, and seamless customer experiences for modern businesses.",
  keywords: ["ai ecommerce", "saas platform", "aramac", "intelligent retail", "ai-powered store", "machine learning commerce", "automated inventory", "smart retail solutions"],
  openGraph: {
    type: "website",
    title: "ΛRΛMΛC Store - AI-Powered E-Commerce SaaS Platform",
    description: "Experience the future of e-commerce with ΛRΛMΛC Store - Advanced AI-driven retail solutions, intelligent inventory management, and seamless customer experiences for modern businesses.",
    url: "/",
    siteName: "ΛRΛMΛC Store",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Note: i18n initialization moved to client-side to prevent build-time issues
  // (was causing 13x repeated initializations during SSG)

  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ConvexClientProvider>
            {/* <CartProvider> */}
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <LanguageProvider>
                  <LanguageAttributes />
                  <CurrencyProvider>
                    {children}
                    <Toaster position="top-right" richColors />
                  </CurrencyProvider>
                </LanguageProvider>
              </ThemeProvider>
            {/* </CartProvider> */}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
