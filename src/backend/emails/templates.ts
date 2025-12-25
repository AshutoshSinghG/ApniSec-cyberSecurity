// email templates

export const welcomeEmailTemplate = (name: string): string => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #1a1a2e;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f4f4f4;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ApniSec</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Welcome to ApniSec - Your Cybersecurity Issue Management Platform!</p>
            <p>We're excited to have you on board. You can now start managing your cybersecurity issues efficiently.</p>
            <p>Our platform supports:</p>
            <ul>
              <li>Cloud Security Issues</li>
              <li>Red Team Assessments</li>
              <li>VAPT (Vulnerability Assessment and Penetration Testing)</li>
            </ul>
            <p>Get started by logging into your dashboard and creating your first issue.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ApniSec. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const issueCreatedEmailTemplate = (issueTitle: string): string => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #1a1a2e;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f4f4f4;
          }
          .issue-box {
            background-color: white;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #1a1a2e;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Issue Created</h1>
          </div>
          <div class="content">
            <h2>Issue Created Successfully</h2>
            <p>Your cybersecurity issue has been created and is now being tracked.</p>
            <div class="issue-box">
              <strong>Issue Title:</strong> ${issueTitle}
            </div>
            <p>You can view and manage this issue from your dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ApniSec. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const profileUpdatedEmailTemplate = (name: string): string => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #1a1a2e;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f4f4f4;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Profile Updated</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your profile has been successfully updated.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ApniSec. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
