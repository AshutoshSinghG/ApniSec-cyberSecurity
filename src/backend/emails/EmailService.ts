import { Resend } from 'resend';
import {
    welcomeEmailTemplate,
    issueCreatedEmailTemplate,
    profileUpdatedEmailTemplate,
} from './templates';

// email service class
class EmailService {
    private resend: Resend;
    private fromEmail: string;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.warn('RESEND_API_KEY not found. Email functionality will be disabled.');
            this.resend = null as any;
        } else {
            this.resend = new Resend(apiKey);
        }

        this.fromEmail = 'ApniSec <onboarding@resend.dev>';
    }

    // send welcome email
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        if (!this.resend) {
            console.log('Email service not configured. Skipping welcome email.');
            return;
        }

        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: 'Welcome to ApniSec',
                html: welcomeEmailTemplate(name),
            });

            console.log(`Welcome email sent to ${email}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
            // don't throw error, just log it
        }
    }

    // send issue created email
    async sendIssueCreatedEmail(email: string, issueTitle: string): Promise<void> {
        if (!this.resend) {
            console.log('Email service not configured. Skipping issue created email.');
            return;
        }

        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: 'New Issue Created - ApniSec',
                html: issueCreatedEmailTemplate(issueTitle),
            });

            console.log(`Issue created email sent to ${email}`);
        } catch (error) {
            console.error('Error sending issue created email:', error);
            // don't throw error, just log it
        }
    }

    // send profile updated email
    async sendProfileUpdatedEmail(email: string, name: string): Promise<void> {
        if (!this.resend) {
            console.log('Email service not configured. Skipping profile updated email.');
            return;
        }

        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: 'Profile Updated - ApniSec',
                html: profileUpdatedEmailTemplate(name),
            });

            console.log(`Profile updated email sent to ${email}`);
        } catch (error) {
            console.error('Error sending profile updated email:', error);
            // don't throw error, just log it
        }
    }
}

export default EmailService;
