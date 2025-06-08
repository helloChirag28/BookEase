import { NextRequest, NextResponse } from 'next/server';
import { generateTimeRecommendation } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { preference, availableSlots, currentTime, date } = await request.json();

    if (!preference || !availableSlots || availableSlots.length === 0) {
      return NextResponse.json(
        { error: 'Preference and available slots are required' },
        { status: 400 }
      );
    }

    const recommendation = await generateTimeRecommendation({
      preference,
      availableSlots,
      currentTime,
      date
    });

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('AI suggestion failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}