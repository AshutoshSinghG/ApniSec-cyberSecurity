import IssueRepository from '../repositories/IssueRepository';
import ApiError from '../errors/ApiError';
import { IIssue, IssueType } from '../models/Issue';

// issue service class
class IssueService {
    private issueRepository: IssueRepository;

    constructor() {
        this.issueRepository = new IssueRepository();
    }

    // create new issue
    async createIssue(
        userId: string,
        issueData: {
            type: IssueType;
            title: string;
            description: string;
            priority?: string;
            status?: string;
        }
    ): Promise<IIssue> {
        const issue = await this.issueRepository.createIssue({
            ...issueData,
            createdBy: userId,
        });

        return issue;
    }

    // get all issues with optional filtering
    async getAllIssues(filter: { type?: IssueType } = {}): Promise<IIssue[]> {
        const issues = await this.issueRepository.findAllIssues(filter);
        return issues;
    }

    // get single issue by id
    async getIssueById(issueId: string): Promise<IIssue> {
        const issue = await this.issueRepository.findIssueById(issueId);

        if (!issue) {
            throw ApiError.notFound('Issue not found');
        }

        return issue;
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
    ): Promise<IIssue> {
        // validate that at least one field is provided
        if (!updateData.title && !updateData.description && !updateData.priority && !updateData.status) {
            throw ApiError.badRequest('At least one field is required for update');
        }

        const issue = await this.issueRepository.updateIssue(issueId, updateData);

        if (!issue) {
            throw ApiError.notFound('Issue not found');
        }

        return issue;
    }

    // delete issue
    async deleteIssue(issueId: string): Promise<void> {
        const issue = await this.issueRepository.deleteIssue(issueId);

        if (!issue) {
            throw ApiError.notFound('Issue not found');
        }
    }
}

export default IssueService;
