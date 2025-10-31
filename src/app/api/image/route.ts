import { NextRequest, NextResponse } from "next/server";

const generateRandomNumber = (): number => {
  return Math.floor(Math.random() * 1000000) + 1;
};

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Valid prompt is required' },
        { status: 400 }
      );
    }

    const randomSeed = generateRandomNumber();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?seed=${randomSeed}&width=512&height=512&nologo=true`;

    // Don't pre-fetch the image, just return the URL
    // The client will load it with an img tag
    return NextResponse.json({
      url: imageUrl,
      success: true,
    });
  } catch (error) {
    console.error('Error in image generation API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate image URL',
        success: false,
      },
      { status: 500 }
    );
  }
}

// Increase the timeout for this route
export const maxDuration = 30; // 30 seconds
export const dynamic = 'force-dynamic';