import User, { IUser } from '../models/User';
import ApiError from '../errors/ApiError';

// user repository class for database operations
class UserRepository {
    // create a new user
    async createUser(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<IUser> {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error: any) {
            // check for duplicate email
            if (error.code === 11000) {
                throw ApiError.badRequest('Email already exists');
            }
            throw error;
        }
    }

    // find user by email
    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email: email.toLowerCase() });
            return user;
        } catch (error) {
            throw error;
        }
    }

    // find user by id
    async findUserById(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId).select('-password');
            return user;
        } catch (error) {
            throw error;
        }
    }

    // update user data
    async updateUser(
        userId: string,
        updateData: { name?: string; email?: string }
    ): Promise<IUser | null> {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select('-password');

            return user;
        } catch (error: any) {
            // check for duplicate email
            if (error.code === 11000) {
                throw ApiError.badRequest('Email already exists');
            }
            throw error;
        }
    }
}

export default UserRepository;
