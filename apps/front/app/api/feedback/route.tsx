import { NextResponse } from 'next/server';
import db from "@repo/db/client" 



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { feedback, feedbackCategory, why, email, phoneNumber } = body;

    if (!feedback || !feedbackCategory) {
      return NextResponse.json({ error: 'Feedback and category are required' }, { status: 400 });
    }

    const newFeedback = await db.feedback.create({
      data: {
        feedback,
        feedbackCategory,
        why,
        email,
        phoneNumber,
      },
    });

    return NextResponse.json({ message: 'Feedback submitted successfully', feedback: newFeedback }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
