import mongoose from 'mongoose';

// MongoDB connection class
class MongoDatabase {
    private static instance: MongoDatabase;
    private isConnected: boolean = false;

    private constructor() { }

    // singleton pattern to ensure only one connection
    public static getInstance(): MongoDatabase {
        if (!MongoDatabase.instance) {
            MongoDatabase.instance = new MongoDatabase();
        }
        return MongoDatabase.instance;
    }

    // connect to mongodb
    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('Already connected to MongoDB');
            return;
        }

        try {
            const mongoUri = process.env.MONGODB_URI;

            if (!mongoUri) {
                throw new Error('MONGODB_URI is not defined in environment variables');
            }

            await mongoose.connect(mongoUri);

            this.isConnected = true;
            console.log('Successfully connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    // disconnect from mongodb
    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('MongoDB disconnection error:', error);
            throw error;
        }
    }

    // check connection status
    public getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

export default MongoDatabase;
