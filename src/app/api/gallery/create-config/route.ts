import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Create a configuration with the gallery image
    const configuration = await db.configuration.create({
      data: {
        imageUrl,
        width: 500,
        height: 500,
      },
    })

    return NextResponse.json({ configId: configuration.id })
  } catch (error) {
    console.error('Error creating configuration:', error)
    return NextResponse.json(
      { error: 'Failed to create configuration' },
      { status: 500 }
    )
  }
}
