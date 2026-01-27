import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'momope-super-secret-key-change-in-production';
const JWT_EXPIRY = '30d'; // 30 days

export interface JWTPayload {
    userId: string;
    mobile: string;
    role: string;
}

/**
 * Generate a JWT token for authenticated users
 */
export function generateToken(userId: string, mobile: string, role: string): string {
    const payload: JWTPayload = {
        userId,
        mobile,
        role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload {
    try {
        // console.log('[JWT_DEBUG] Secret:', JWT_SECRET.substring(0, 3) + '...');
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        // console.error('[JWT_DEBUG] Token Error:', error);
        throw new Error('Invalid or expired token');
    }
}


/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

export async function verifyJWT(req: Request): Promise<JWTPayload | null> {
    const authHeader = req.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) return null;
    try {
        return verifyToken(token);
    } catch {
        return null;
    }
}
