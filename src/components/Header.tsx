"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth, UserButton } from "@clerk/nextjs"
import { useCart } from "@/hooks/useCart"
import { useLanguage } from "@/components/LanguageProvider"
import { SearchBar } from "@/components/SearchBar"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { CurrencySelector } from "@/components/CurrencySelector"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function Header() {
  const { isSignedIn, user, userId } = useAuth()
  const { cartCount } = useCart()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Get wishlist count from Convex
  const wishlistCount = useQuery(
    api.wishlists.getWishlistCount,
    isSignedIn && userId ? { userId } : "skip"
  ) || 0

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl">Aramac Branfing</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar placeholder={t('forms.placeholder.search')} />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.products')}
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.categories')}
            </Link>
            <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.collections')}
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.blog')}
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            ) : (
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Currency Selector */}
            <CurrencySelector variant="compact" showRates />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <SearchBar placeholder={t('forms.placeholder.search')} />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>
              <Link
                href="/collections"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.collections')}
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}