"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface BreadcrumbItem {
  label: string
  href: string
  isLast?: boolean
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[]
  showHome?: boolean
  maxItems?: number
}

export function Breadcrumbs({
  customItems,
  showHome = true,
  maxItems = 5
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems

    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    if (showHome) {
      breadcrumbs.push({
        label: 'Inicio',
        href: '/',
        isLast: segments.length === 0
      })
    }

    let currentPath = ''

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Convert segment to readable label
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())

      // Handle dynamic routes
      if (segment.match(/^[a-f0-9]{32}$/)) {
        // This is likely a Convex ID, skip it
        return
      }

      // Special cases for known routes
      switch (segment) {
        case 'products':
          label = 'Productos'
          break
        case 'categories':
          label = 'Categorías'
          break
        case 'search':
          label = 'Buscar'
          break
        case 'cart':
          label = 'Carrito'
          break
        case 'checkout':
          label = 'Checkout'
          break
        case 'account':
          label = 'Cuenta'
          break
        case 'wishlist':
          label = 'Lista de Deseos'
          break
        case 'admin':
          label = 'Administración'
          break
        default:
          // For dynamic routes like [slug], try to get the actual name
          if (segments[index - 1] === 'products' && segments.length > index + 1) {
            // This might be a product slug, we'll handle this with a query
            label = 'Producto'
          } else if (segments[index - 1] === 'categories' && segments.length > index + 1) {
            // This might be a category slug
            label = 'Categoría'
          }
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast
      })
    })

    return breadcrumbs.slice(0, maxItems)
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            )}

            {breadcrumb.isLast ? (
              <span
                className="font-medium text-gray-900"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                {index === 0 && <Home className="h-4 w-4" />}
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Specialized breadcrumb for products
export function ProductBreadcrumbs({ productId }: { productId: string }) {
  const product = useQuery(api.products.getProductBySlug, { slug: productId })

  if (!product) {
    return <Breadcrumbs />
  }

  // For products, we need to get category information
  const category = useQuery(api.categories.getCategories)?.find(
    cat => cat._id === product.categoryId
  )

  const customItems: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/products' }
  ]

  if (category) {
    customItems.push({
      label: category.name,
      href: `/categories/${category.slug}`
    })
  }

  customItems.push({
    label: product.name,
    href: `/products/${product.slug}`,
    isLast: true
  })

  return <Breadcrumbs customItems={customItems} />
}

// Specialized breadcrumb for categories
export function CategoryBreadcrumbs({ categoryId }: { categoryId: string }) {
  const category = useQuery(api.categories.getCategories)?.find(
    cat => cat._id === categoryId
  )

  if (!category) {
    return <Breadcrumbs />
  }

  const customItems: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorías', href: '/categories' }
  ]

  // If this is a subcategory, add parent category
  if (category.parentId) {
    const parentCategory = useQuery(api.categories.getCategories)?.find(
      cat => cat._id === category.parentId
    )
    if (parentCategory) {
      customItems.push({
        label: parentCategory.name,
        href: `/categories/${parentCategory.slug}`
      })
    }
  }

  customItems.push({
    label: category.name,
    href: `/categories/${category.slug}`,
    isLast: true
  })

  return <Breadcrumbs customItems={customItems} />
}

// Specialized breadcrumb for search
export function SearchBreadcrumbs({ query }: { query: string }) {
  const customItems: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: `Buscar: "${query}"`, href: `/search?q=${encodeURIComponent(query)}`, isLast: true }
  ]

  return <Breadcrumbs customItems={customItems} />
}