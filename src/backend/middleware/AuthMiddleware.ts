import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import ApiError from '../errors/ApiError';

// auth middleware class
class AuthMiddleware {
    private jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    }

    // verify authentication token
    verifyAuth(request: NextRequest): string {
        try {
            // get token from cookies
            const token = request.cookies.get('token')?.value;

            if (!token) {
                throw ApiError.unauthorized('Authentication required');
            }

            // verify token
            const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };

            if (!decoded.userId) {
                throw ApiError.unauthorized('Invalid token');
            }

            return decoded.userId;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unauthorized('Invalid or expired token');
        }
    }
}

export default AuthMiddleware;
