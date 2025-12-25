import Issue, { IIssue, IssueType } from '../models/Issue';
import ApiError from '../errors/ApiError';

// issue repository class for database operations
class IssueRepository {
    // create a new issue
    async createIssue(issueData: {
        type: IssueType;
        title: string;
        description: string;
        priority?: string;
        status?: string;
        createdBy: string;
    }): Promise<IIssue> {
        try {
            const issue = new Issue(issueData);
            await issue.save();
            return issue;
        } catch (error) {
            throw error;
        }
    }

    // find all issues with optional filtering
    async findAllIssues(filter: { type?: IssueType } = {}): Promise<IIssue[]> {
        try {
            const query: any = {};

            // add type filter if provided
            if (filter.type) {
                query.type = filter.type;
            }

            const issues = await Issue.find(query)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 });

            return issues;
        } catch (error) {
            throw error;
        }
    }

    // find issue by id
    async findIssueById(issueId: string): Promise<IIssue | null> {
        try {
            const issue = await Issue.findById(issueId).populate('createdBy', 'name email');
            return issue;
        } catch (error) {
            throw error;
        }
    }

    // update issue
    async updateIssue(
        issueId: string,
        updateData: {
            title?: string;
            description?: string;
            priority?: string;
            status?: string;
        }
    ): Promise<IIssue | null> {
        try {
            const issue = await Issue.findByIdAndUpdate(
                issueId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate('createdBy', 'name email');

            return issue;
        } catch (error) {
            throw error;
        }
    }

    // delete issue
    async deleteIssue(issueId: string): Promise<IIssue | null> {
        try {
            const issue = await Issue.findByIdAndDelete(issueId);
            return issue;
        } catch (error) {
            throw error;
        }
    }
}

export default IssueRepository;
