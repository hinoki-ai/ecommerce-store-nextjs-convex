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
    const links = await affiliateService.getAffiliateLinks(affiliateId)
    return NextResponse.json(links)

  } catch (error) {
    console.error('Affiliate Links Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateId, name, description, category, url } = body

    if (!affiliateId || !name) {
      return NextResponse.json({ 
        error: 'affiliateId and name are required' 
      }, { status: 400 })
    }

    const link = await affiliateService.createAffiliateLink(affiliateId, {
      name,
      description,
      category,
      url
    })

    return NextResponse.json(link, { status: 201 })

  } catch (error) {
    console.error('Affiliate Link Creation Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}