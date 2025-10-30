import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.category || !body.message || body.consent === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate nps (0-10 if provided)
    if (body.nps !== null && (body.nps < 0 || body.nps > 10)) {
      return NextResponse.json({ error: 'Invalid NPS' }, { status: 400 })
    }

    // Validate category
    const validCategories = ['Bug report', 'Feature request', 'General feedback']
    if (!validCategories.includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Create feedback in Firestore
    const docRef = await addDoc(collection(db, "feedback"), {
      category: body.category,
      nps: body.nps,
      message: body.message,
      images: body.images || [],
      email: body.email || null,
      okToContact: body.okToContact,
      consent: body.consent,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
 