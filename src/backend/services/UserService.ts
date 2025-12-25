import UserRepository from '../repositories/UserRepository';
import ApiError from '../errors/ApiError';
import { IUser } from '../models/User';

// user service class
class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    // get user profile
    async getUserProfile(userId: string): Promise<IUser> {
        const user = await this.userRepository.findUserById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user;
    }

    // update user profile
    async updateUserProfile(
        userId: string,
        updateData: { name?: string; email?: string }
    ): Promise<IUser> {
        // validate that at least one field is provided
        if (!updateData.name && !updateData.email) {
            throw ApiError.badRequest('At least one field (name or email) is required');
        }

        const user = await this.userRepository.updateUser(userId, updateData);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user;
    }
}

export default UserService;
