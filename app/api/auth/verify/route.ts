import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No valid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session.user,
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Token verification failed' },
      { status: 401 }
    );
  }
}