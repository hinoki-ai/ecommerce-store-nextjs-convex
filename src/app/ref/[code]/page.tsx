import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getAffiliateService } from "@/lib/affiliate"

interface ReferralPageProps {
  params: Promise<{ code: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ReferralPage({ params, searchParams }: ReferralPageProps) {
  const { code } = await params
  const search = await searchParams
  const affiliateService = getAffiliateService()
  
  // Get affiliate by code
  const affiliate = await affiliateService.getAffiliateByCode(code.toUpperCase())
  
  if (!affiliate || affiliate.status !== 'active') {
    // Invalid or inactive affiliate code, redirect to home
    redirect('/')
  }

  // Track the click
  const clickData = {
    ipAddress: '127.0.0.1', // In production, get from request headers
    userAgent: 'User Agent String', // In production, get from request headers
    referrerUrl: search.ref as string,
    landingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/ref/${code}`,
    utmSource: search.utm_source as string,
    utmMedium: search.utm_medium as string,
    utmCampaign: search.utm_campaign as string,
    sessionId: 'session-123' // In production, generate or get from session
  }

  await affiliateService.trackClick(code.toUpperCase(), clickData)

  // Set affiliate tracking cookie
  const cookieStore = cookies()
  cookieStore.set('affiliate_code', code.toUpperCase(), {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  // Redirect to target page or home
  const targetUrl = (search.redirect as string) || '/'
  redirect(targetUrl)
}

export async function generateMetadata({ params }: ReferralPageProps) {
  const { code } = await params
  const affiliateService = getAffiliateService()
  const affiliate = await affiliateService.getAffiliateByCode(code.toUpperCase())

  if (!affiliate) {
    return {
      title: 'Enlace no válido',
      description: 'Este enlace de afiliado no es válido o ha expirado.'
    }
  }

  return {
    title: `Invitación de ${affiliate.code}`,
    description: 'Has sido invitado a descubrir productos increíbles con descuentos especiales.',
    openGraph: {
      title: 'Descubre productos increíbles',
      description: 'Has sido invitado a una experiencia de compras exclusiva.',
      images: ['/api/placeholder/1200/630']
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Descubre productos increíbles',
      description: 'Has sido invitado a una experiencia de compras exclusiva.',
      images: ['/api/placeholder/1200/630']
    }
  }
}