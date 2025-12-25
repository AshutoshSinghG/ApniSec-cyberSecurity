import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// user interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// user schema definition
const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    {
        timestamps: true,
    }
);

// hash password before saving
UserSchema.pre('save', async function (next) {
    // only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// method to compare passwords
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

// create and export user model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
