import { NextRequest } from 'next/server';
import AuthService from '../services/AuthService';
import AuthValidator from '../validators/AuthValidator';
import EmailService from '../emails/EmailService';
import { IUser } from '../models/User';

// auth handler class
class AuthHandler {
    private authService: AuthService;
    private authValidator: AuthValidator;
    private emailService: EmailService;

    constructor() {
        this.authService = new AuthService();
        this.authValidator = new AuthValidator();
        this.emailService = new EmailService();
    }

    // handle user registration
    async handleRegister(request: NextRequest): Promise<{ user: IUser; token: string }> {
        const body = await request.json();

        // validate input data
        const validatedData = this.authValidator.validateRegisterData(body);

        // register user
        const { user, token } = await this.authService.register(validatedData);

        // send welcome email (async, don't wait)
        this.emailService.sendWelcomeEmail(user.email, user.name).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        return { user, token };
    }

    // handle user login
    async handleLogin(request: NextRequest): Promise<{ user: IUser; token: string }> {
        const body = await request.json();

        // validate input data
        const validatedData = this.authValidator.validateLoginData(body);

        // login user
        const { user, token } = await this.authService.login(
            validatedData.email,
            validatedData.password
        );

        return { user, token };
    }

    // handle logout
    async handleLogout(): Promise<{ message: string }> {
        return { message: 'Logged out successfully' };
    }

    // handle get current user
    async handleGetCurrentUser(userId: string): Promise<IUser> {
        const userService = (await import('../services/UserService')).default;
        const service = new userService();
        const user = await service.getUserProfile(userId);
        return user;
    }
}

export default AuthHandler;
