import { NextRequest, NextResponse } from 'next/server';
import MongoDatabase from '@/src/backend/db/mongo';
import IssueHandler from '@/src/backend/handlers/IssueHandler';
import AuthMiddleware from '@/src/backend/middleware/AuthMiddleware';
import RateLimiter from '@/src/backend/middleware/RateLimiter';
import ApiError from '@/src/backend/errors/ApiError';

// initialize rate limiter
const rateLimiter = new RateLimiter();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        authMiddleware.verifyAuth(request);

        // connect to database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // get issue
        const issueHandler = new IssueHandler();
        const issue = await issueHandler.handleGetIssue(params.id);

        const response = NextResponse.json(
            {
                success: true,
                issue: issue,
            },
            { status: 200 }
        );

        // add rate limit headers
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

        return response;
    } catch (error: any) {
        console.error('Get issue error:', error);

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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        authMiddleware.verifyAuth(request);

        // connect to database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // update issue
        const issueHandler = new IssueHandler();
        const issue = await issueHandler.handleUpdateIssue(params.id, request);

        const response = NextResponse.json(
            {
                success: true,
                message: 'Issue updated successfully',
                issue: issue,
            },
            { status: 200 }
        );

        // add rate limit headers
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

        return response;
    } catch (error: any) {
        console.error('Update issue error:', error);

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        authMiddleware.verifyAuth(request);

        // connect to database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // delete issue
        const issueHandler = new IssueHandler();
        const result = await issueHandler.handleDeleteIssue(params.id);

        const response = NextResponse.json(
            {
                success: true,
                message: result.message,
            },
            { status: 200 }
        );

        // add rate limit headers
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

        return response;
    } catch (error: any) {
        console.error('Delete issue error:', error);

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
