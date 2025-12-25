import { NextRequest } from 'next/server';
import IssueService from '../services/IssueService';
import IssueValidator from '../validators/IssueValidator';
import EmailService from '../emails/EmailService';
import UserService from '../services/UserService';
import { IIssue, IssueType } from '../models/Issue';

// issue handler class
class IssueHandler {
    private issueService: IssueService;
    private issueValidator: IssueValidator;
    private emailService: EmailService;
    private userService: UserService;

    constructor() {
        this.issueService = new IssueService();
        this.issueValidator = new IssueValidator();
        this.emailService = new EmailService();
        this.userService = new UserService();
    }

    // handle create issue
    async handleCreateIssue(userId: string, request: NextRequest): Promise<IIssue> {
        const body = await request.json();

        // validate issue data
        const validatedData = this.issueValidator.validateIssueData(body);

        // create issue
        const issue = await this.issueService.createIssue(userId, validatedData);

        // get user email for notification
        const user = await this.userService.getUserProfile(userId);

        // send issue created email (async, don't wait)
        this.emailService.sendIssueCreatedEmail(user.email, issue.title).catch(err => {
            console.error('Failed to send issue created email:', err);
        });

        return issue;
    }

    // handle get all issues
    async handleGetAllIssues(
        userId: string,
        searchParams: URLSearchParams
    ): Promise<IIssue[]> {
        // get type filter from query params
        const type = searchParams.get('type') as IssueType | null;

        // validate type if provided
        if (type) {
            this.issueValidator.validateIssueType(type);
        }

        // get issues
        const filter = type ? { type } : {};
        const issues = await this.issueService.getAllIssues(filter);

        return issues;
    }

    // handle get single issue
    async handleGetIssue(issueId: string): Promise<IIssue> {
        const issue = await this.issueService.getIssueById(issueId);
        return issue;
    }

    // handle update issue
    async handleUpdateIssue(issueId: string, request: NextRequest): Promise<IIssue> {
        const body = await request.json();
        const { title, description, priority, status } = body;

        // update issue
        const issue = await this.issueService.updateIssue(issueId, {
            title,
            description,
            priority,
            status,
        });

        return issue;
    }

    // handle delete issue
    async handleDeleteIssue(issueId: string): Promise<{ message: string }> {
        await this.issueService.deleteIssue(issueId);
        return { message: 'Issue deleted successfully' };
    }
}

export default IssueHandler;
