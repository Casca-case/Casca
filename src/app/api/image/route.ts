"use server"
import { NextRequest } from "next/server.js";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000000) + 1;
  }
  const randomSeed = generateRandomNumber();
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&width=512&height=512&nologo=True`;
  await fetch(imageUrl);
  return NextResponse.json({
    url: imageUrl,
  });
}