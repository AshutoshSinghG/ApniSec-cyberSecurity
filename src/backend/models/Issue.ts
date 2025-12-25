import mongoose, { Schema, Document, Model } from 'mongoose';

// issue types
export type IssueType = 'cloud-security' | 'red-team' | 'vapt';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

// issue interface
export interface IIssue extends Document {
    type: IssueType;
    title: string;
    description: string;
    priority: IssuePriority;
    status: IssueStatus;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// issue schema definition
const IssueSchema: Schema<IIssue> = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['cloud-security', 'red-team', 'vapt'],
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved', 'closed'],
            default: 'open',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// create and export issue model
const Issue: Model<IIssue> = mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);

export default Issue;
