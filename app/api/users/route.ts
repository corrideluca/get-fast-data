import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phoneNumber } = body;

    if (!userId || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or phoneNumber' },
        { status: 400 }
      );
    }

    // Update user with phone number
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { phoneNumber },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
