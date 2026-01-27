import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/lib/jwt';

export type AuthResult =
    | { success: true; user: JWTPayload }
    | { success: false; response: NextResponse };

/**
 * Middleware to verify JWT tokens on protected routes
 */
export async function verifyJWT(request: NextRequest): Promise<AuthResult> {
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    console.log('[AUTH_DEBUG] Header:', authHeader);

    if (!token) {
        console.log('[AUTH_DEBUG] No token found');
        return {
            success: false,
            response: NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            )
        };
    }

    try {
        const decoded = verifyToken(token);
        console.log('[AUTH_DEBUG] Token verified for:', decoded.userId);
        return { success: true, user: decoded };
    } catch (error) {
        console.error('[AUTH_DEBUG] Verification Error:', error);
        return {
            success: false,
            response: NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid or expired token' },
                { status: 401 }
            )
        };
    }
}

