import { NextRequest, NextResponse } from 'next/server';
import { FirebaseAuthService } from '@/lib/firebase-auth';
import { createSessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, idToken } = await request.json();

    // Validate input
    if (!email || (!password && !idToken)) {
      return NextResponse.json(
        { success: false, error: 'Email and password or ID token are required' },
        { status: 400 }
      );
    }

    let userUid: string;

    if (idToken) {
      // Verify ID token from client-side authentication
      try {
        const decodedToken = await FirebaseAuthService.verifyIdToken(idToken);
        userUid = decodedToken.uid;
        
        // Verify email matches
        if (decodedToken.email !== email) {
          return NextResponse.json(
            { success: false, error: 'Token email mismatch' },
            { status: 401 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    } else {
      // Fallback: check if user exists (for development)
      const user = await FirebaseAuthService.getUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      userUid = user.id;
    }

    // Get user details with admin verification
    const user = await FirebaseAuthService.getUserById(userUid);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = createSessionToken(user);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}