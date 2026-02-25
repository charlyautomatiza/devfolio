import { getManifestData } from '@/lib/siteConfig'
import { NextResponse } from 'next/server'

export async function GET() {
  const manifestData = getManifestData()
  
  return NextResponse.json(manifestData, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
