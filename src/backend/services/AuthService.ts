import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';
import ApiError from '../errors/ApiError';
import { IUser } from '../models/User';

// auth service class
class AuthService {
    private userRepository: UserRepository;
    private jwtSecret: string;

    constructor() {
        this.userRepository = new UserRepository();
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    }

    // register new user
    async register(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<{ user: IUser; token: string }> {
        // check if user already exists
        const existingUser = await this.userRepository.findUserByEmail(userData.email);
        if (existingUser) {
            throw ApiError.badRequest('User with this email already exists');
        }

        // create new user
        const user = await this.userRepository.createUser(userData);

        // generate token
        const token = this.generateToken(user._id.toString());

        return { user, token };
    }

    // login user
    async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
        // find user by email
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // generate token
        const token = this.generateToken(user._id.toString());

        return { user, token };
    }

    // generate jwt token
    generateToken(userId: string): string {
        const token = jwt.sign({ userId }, this.jwtSecret, {
            expiresIn: '7d',
        });
        return token;
    }

    // verify jwt token
    verifyToken(token: string): { userId: string } {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
            return decoded;
        } catch (error) {
            throw ApiError.unauthorized('Invalid or expired token');
        }
    }
}

export default AuthService;
