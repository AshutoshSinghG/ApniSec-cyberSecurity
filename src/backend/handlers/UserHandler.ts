import { NextRequest } from 'next/server';
import UserService from '../services/UserService';
import EmailService from '../emails/EmailService';
import { IUser } from '../models/User';

// user handler class
class UserHandler {
    private userService: UserService;
    private emailService: EmailService;

    constructor() {
        this.userService = new UserService();
        this.emailService = new EmailService();
    }

    // handle get user profile
    async handleGetProfile(userId: string): Promise<IUser> {
        const user = await this.userService.getUserProfile(userId);
        return user;
    }

    // handle update user profile
    async handleUpdateProfile(userId: string, request: NextRequest): Promise<IUser> {
        const body = await request.json();
        const { name, email } = body;

        // update user profile
        const user = await this.userService.updateUserProfile(userId, { name, email });

        // send profile updated email (async, don't wait)
        this.emailService.sendProfileUpdatedEmail(user.email, user.name).catch(err => {
            console.error('Failed to send profile updated email:', err);
        });

        return user;
    }
}

export default UserHandler;
