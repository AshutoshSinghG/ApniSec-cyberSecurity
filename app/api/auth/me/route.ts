import { NextRequest, NextResponse } from 'next/server';
import MongoDatabase from '@/src/backend/db/mongo';
import AuthHandler from '@/src/backend/handlers/AuthHandler';
import AuthMiddleware from '@/src/backend/middleware/AuthMiddleware';
import ApiError from '@/src/backend/errors/ApiError';

export async function GET(request: NextRequest) {
    try {
        // verify authentication
        const authMiddleware = new AuthMiddleware();
        const userId = authMiddleware.verifyAuth(request);

        // connect to database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // get current user
        const authHandler = new AuthHandler();
        const user = await authHandler.handleGetCurrentUser(userId);

        return NextResponse.json(
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
    } catch (error: any) {
        console.error('Get current user error:', error);

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
