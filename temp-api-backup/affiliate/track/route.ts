import { NextRequest, NextResponse } from "next/server"
import { getAffiliateService } from "@/lib/affiliate"

const affiliateService = getAffiliateService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'click') {
      const { affiliateCode, ...clickData } = data
      
      if (!affiliateCode) {
        return NextResponse.json({ error: 'affiliateCode is required' }, { status: 400 })
      }

      // Enhanced click data with request info
      const enrichedClickData = {
        ...clickData,
        ipAddress: request.ip || 
                  request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1',
        userAgent: request.headers.get('user-agent') || '',
        referrerUrl: request.headers.get('referer') || clickData.referrerUrl
      }

      const click = await affiliateService.trackClick(affiliateCode, enrichedClickData)
      
      if (!click) {
        return NextResponse.json({ error: 'Invalid or inactive affiliate code' }, { status: 404 })
      }

      return NextResponse.json({ success: true, clickId: click.id })

    } else if (type === 'conversion') {
      const { orderId, customerId, orderAmount, affiliateCode } = data
      
      if (!orderId || !customerId || !orderAmount) {
        return NextResponse.json({ 
          error: 'orderId, customerId, and orderAmount are required' 
        }, { status: 400 })
      }

      const commission = await affiliateService.trackConversion(
        orderId,
        customerId, 
        orderAmount,
        affiliateCode
      )

      if (!commission) {
        return NextResponse.json({ 
          message: 'No eligible affiliate found for this conversion',
          success: false 
        })
      }

      return NextResponse.json({ 
        success: true, 
        commissionId: commission.id,
        commissionAmount: commission.commissionAmount
      })

    } else {
      return NextResponse.json({ error: 'Invalid tracking type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Affiliate Tracking Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}