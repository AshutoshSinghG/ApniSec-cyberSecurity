import ApiError from '../errors/ApiError';
import { IssueType } from '../models/Issue';

// issue validator class
class IssueValidator {
    // validate issue data
    validateIssueData(data: any): {
        type: IssueType;
        title: string;
        description: string;
        priority?: string;
        status?: string;
    } {
        const { type, title, description, priority, status } = data;

        // check required fields
        if (!type || !title || !description) {
            throw ApiError.badRequest('Type, title, and description are required');
        }

        // validate issue type
        this.validateIssueType(type);

        // validate title
        if (typeof title !== 'string' || title.trim().length < 5) {
            throw ApiError.badRequest('Title must be at least 5 characters long');
        }

        // validate description
        if (typeof description !== 'string' || description.trim().length < 10) {
            throw ApiError.badRequest('Description must be at least 10 characters long');
        }

        // validate priority if provided
        if (priority && !['low', 'medium', 'high', 'critical'].includes(priority)) {
            throw ApiError.badRequest('Invalid priority value');
        }

        // validate status if provided
        if (status && !['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
            throw ApiError.badRequest('Invalid status value');
        }

        const validatedData: any = {
            type,
            title: title.trim(),
            description: description.trim(),
        };

        if (priority) validatedData.priority = priority;
        if (status) validatedData.status = status;

        return validatedData;
    }

    // validate issue type
    validateIssueType(type: string): void {
        const validTypes = ['cloud-security', 'red-team', 'vapt'];
        if (!validTypes.includes(type)) {
            throw ApiError.badRequest(
                `Invalid issue type. Must be one of: ${validTypes.join(', ')}`
            );
        }
    }
}

export default IssueValidator;
