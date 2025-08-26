"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/LanguageProvider"

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="ΛRΛMΛC Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none">ΛRΛMΛC</span>
                <span className="text-xs text-muted-foreground leading-none">Store</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              {t('seo.description')}
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.quickLinks')}</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.products')}
              </Link>
              <Link href="/categories" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.categories')}
              </Link>
              <Link href="/collections" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.collections')}
              </Link>
              <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.blog')}
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.about')}
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.customerService')}</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.helpCenter')}
              </Link>
              <Link href="/shipping" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.shippingInfo')}
              </Link>
              <Link href="/returns" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.returnsExchanges')}
              </Link>
              <Link href="/size-guide" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.sizeGuide')}
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.contactInfo')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{t('footer.phone')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{t('footer.email')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 ΛRΛMΛC Store. {t('footer.allRightsReserved')}
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t('footer.termsOfService')}
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              {t('footer.cookiePolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}