import { NextRequest, NextResponse } from 'next/server';
import AuthHandler from '@/src/backend/handlers/AuthHandler';
import ApiError from '@/src/backend/errors/ApiError';

export async function POST(request: NextRequest) {
    try {
        // handle logout
        const authHandler = new AuthHandler();
        const result = await authHandler.handleLogout();

        // create response
        const response = NextResponse.json(
            {
                success: true,
                message: result.message,
            },
            { status: 200 }
        );

        // clear token cookie
        response.cookies.delete('token');

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);

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
