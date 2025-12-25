import { NextRequest, NextResponse } from 'next/server';
import MongoDatabase from '@/src/backend/db/mongo';
import UserHandler from '@/src/backend/handlers/UserHandler';
import AuthMiddleware from '@/src/backend/middleware/AuthMiddleware';
import RateLimiter from '@/src/backend/middleware/RateLimiter';
import ApiError from '@/src/backend/errors/ApiError';

// initialize rate limiter
const rateLimiter = new RateLimiter();

export async function GET(request: NextRequest) {
    try {
        // check rate limit
        const rateLimit = rateLimiter.checkRateLimit(request);

        if (!rateLimit.allowed) {
            const resetDate = new Date(rateLimit.resetTime);
            throw ApiError.tooManyRequests(
                `Rate limit exceeded. Try again after ${resetDate.toISOString()}`
            );
        }

        // verify authentication
        const authMiddleware = new AuthMiddleware();
        const userId = authMiddleware.verifyAuth(request);

        // connect to database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // get user profile
        const userHandler = new UserHandler();
        const user = await userHandler.handleGetProfile(userId);

        const response = NextResponse.json(
            {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                },
            },
            { status: 200 }
        );

        // add rate limit headers
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

        return response;
    } catch (error: any) {
        console.error('Get profile error:', error);

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

export async function PUT(request: NextRequest) {
    try {
        // check rate limit
        const rateLimit = rateLimiter.checkRateLimit(request);

        if (!rateLimit.allowed) {
            const resetDate = new Date(rateLimit.resetTime);
            throw ApiError.tooManyRequests(
                `Rate limit exceeded. Try again after ${resetDate.toISOString()}`
            );
        }

        // verify authentication
        const authMiddleware = new AuthMiddleware();
        const userId = authMiddleware.verifyAuth(request);

        // connect to database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // update user profile
        const userHandler = new UserHandler();
        const user = await userHandler.handleUpdateProfile(userId, request);

        const response = NextResponse.json(
            {
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );

        // add rate limit headers
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

        return response;
    } catch (error: any) {
        console.error('Update profile error:', error);

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
