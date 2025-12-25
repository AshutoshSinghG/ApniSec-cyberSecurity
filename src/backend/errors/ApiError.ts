// custom api error class
class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    // static methods for common errors
    static badRequest(message: string): ApiError {
        return new ApiError(400, message);
    }

    static unauthorized(message: string = 'Unauthorized'): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message: string = 'Forbidden'): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message: string = 'Not found'): ApiError {
        return new ApiError(404, message);
    }

    static tooManyRequests(message: string = 'Too many requests'): ApiError {
        return new ApiError(429, message);
    }

    static internal(message: string = 'Internal server error'): ApiError {
        return new ApiError(500, message, false);
    }
}

export default ApiError;
