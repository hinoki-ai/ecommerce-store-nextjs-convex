import { NextRequest, NextResponse } from "next/server"
import { getAffiliateService } from "@/lib/affiliate"

const affiliateService = getAffiliateService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateId, amount, method } = body

    if (!affiliateId || !amount || !method) {
      return NextResponse.json({ 
        error: 'affiliateId, amount, and method are required' 
      }, { status: 400 })
    }

    if (amount < 50) {
      return NextResponse.json({ 
        error: 'Minimum payout amount is $50' 
      }, { status: 400 })
    }

    const payout = await affiliateService.requestPayout(affiliateId, amount, method)
    return NextResponse.json(payout, { status: 201 })

  } catch (error) {
    console.error('Payout Request Error:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Affiliate not found') {
        return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
      }
      if (error.message === 'Insufficient approved commissions') {
        return NextResponse.json({ error: 'Insufficient approved commissions' }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}