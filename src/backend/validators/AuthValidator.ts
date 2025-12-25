import ApiError from '../errors/ApiError';

// auth validator class
class AuthValidator {
    // validate registration data
    validateRegisterData(data: any): {
        name: string;
        email: string;
        password: string;
    } {
        const { name, email, password } = data;

        // check if all fields are provided
        if (!name || !email || !password) {
            throw ApiError.badRequest('Name, email, and password are required');
        }

        // validate name
        if (typeof name !== 'string' || name.trim().length < 2) {
            throw ApiError.badRequest('Name must be at least 2 characters long');
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw ApiError.badRequest('Invalid email format');
        }

        // validate password length
        if (password.length < 6) {
            throw ApiError.badRequest('Password must be at least 6 characters long');
        }

        return {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        };
    }

    // validate login data
    validateLoginData(data: any): { email: string; password: string } {
        const { email, password } = data;

        // check if all fields are provided
        if (!email || !password) {
            throw ApiError.badRequest('Email and password are required');
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw ApiError.badRequest('Invalid email format');
        }

        return {
            email: email.trim().toLowerCase(),
            password,
        };
    }
}

export default AuthValidator;
