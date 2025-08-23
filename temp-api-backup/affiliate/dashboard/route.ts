import { NextRequest, NextResponse } from "next/server"
import { getAffiliateService } from "@/lib/affiliate"

const affiliateService = getAffiliateService()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const affiliateId = searchParams.get('affiliateId')

  if (!affiliateId) {
    return NextResponse.json({ error: 'affiliateId is required' }, { status: 400 })
  }

  try {
    const dashboard = await affiliateService.getAffiliateDashboard(affiliateId)
    return NextResponse.json(dashboard)

  } catch (error) {
    console.error('Affiliate Dashboard Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}