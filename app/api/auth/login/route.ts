import { NextRequest, NextResponse } from 'next/server';
import MongoDatabase from '@/src/backend/db/mongo';
import AuthHandler from '@/src/backend/handlers/AuthHandler';
import RateLimiter from '@/src/backend/middleware/RateLimiter';
import ApiError from '@/src/backend/errors/ApiError';

// initialize rate limiter
const rateLimiter = new RateLimiter();

export async function POST(request: NextRequest) {
    try {
        // check rate limit
        const rateLimit = rateLimiter.checkRateLimit(request);

        if (!rateLimit.allowed) {
            const resetDate = new Date(rateLimit.resetTime);
            throw ApiError.tooManyRequests(
                `Rate limit exceeded. Try again after ${resetDate.toISOString()}`
            );
        }

        // connect to database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // handle login
        const authHandler = new AuthHandler();
        const { user, token } = await authHandler.handleLogin(request);

        // create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );

        // set token in cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // add rate limit headers
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

        return response;
    } catch (error: any) {
        console.error('Login error:', error);

        if (error instanceof ApiError) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: error.statusCode }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
