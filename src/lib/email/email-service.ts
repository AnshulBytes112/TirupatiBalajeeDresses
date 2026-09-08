import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit/audit-logger";

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: "USER_INVITATION" | "PASSWORD_RESET" | "SECURITY_ALERT" | "ORDER_NOTIFICATION" | "ADMIN_ALERT";
  htmlContent: string;
  metadata?: Record<string, any>;
}

export class EmailService {
  /**
   * Dispatches email notification, logs to database, and records audit event
   */
  async sendEmail(options: SendEmailOptions) {
    const { to, subject, template, htmlContent, metadata } = options;

    try {
      // In production, integrate SMTP (Nodemailer), SendGrid, or Resend
      // Here we log the structured delivery and persist in PostgreSQL
      console.log(`\n======================================================`);
      console.log(`📨 [EMAIL SERVICE DISPATCH] Template: ${template}`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Metadata:`, metadata);
      console.log(`======================================================\n`);

      const log = await prisma.emailLog.create({
        data: {
          to,
          subject,
          template,
          bodyPreview: htmlContent.replace(/<[^>]*>?/gm, "").slice(0, 300),
          status: "DELIVERED",
          metadata: metadata || undefined,
          sentAt: new Date(),
        },
      });

      return {
        success: true,
        logId: log.id,
        status: "DELIVERED",
        sentAt: log.sentAt,
      };
    } catch (error) {
      console.error("Email dispatch failed:", error);
      return {
        success: false,
        error: String(error),
        status: "FAILED",
      };
    }
  }

  /**
   * Template 1: User Onboarding / Invitation with Temporary Credentials
   */
  async sendUserInvitation(params: {
    name: string;
    email: string;
    username: string;
    tempPassword: string;
    role: string;
    portalUrl?: string;
  }) {
    const { name, email, username, tempPassword, role, portalUrl } = params;
    const loginLink = portalUrl || "http://localhost:3000/admin";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #FAF7F2; border: 1px solid #E5DCD3; border-radius: 16px;">
        <h2 style="color: #1C1917; margin-top: 0;">Welcome to TirupatiBalajee Dresses</h2>
        <p style="color: #44403C; font-size: 14px;">Hello <strong>${name || "Staff Member"}</strong>,</p>
        <p style="color: #44403C; font-size: 14px;">An administrative account has been created for you with the role of <strong>${role.replace("_", " ")}</strong>.</p>
        
        <div style="background-color: #FFFFFF; border: 1px solid #E5DCD3; padding: 18px; border-radius: 12px; margin: 20px 0;">
          <h4 style="margin: 0 0 12px 0; color: #1C1917; font-size: 13px; text-transform: uppercase;">Your Temporary Credentials:</h4>
          <p style="margin: 6px 0; font-family: monospace; font-size: 14px;"><strong>Username:</strong> ${username}</p>
          <p style="margin: 6px 0; font-family: monospace; font-size: 14px;"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>

        <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; padding: 12px; border-radius: 8px; font-size: 12px; color: #92400E; margin-bottom: 20px;">
          ⚠️ <strong>First Login Security:</strong> For your security, you are required to change this temporary password immediately upon your first login.
        </div>

        <p style="text-align: center; margin: 24px 0;">
          <a href="${loginLink}" style="background-color: #1C1917; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Access Admin Portal</a>
        </p>

        <p style="color: #78716C; font-size: 11px; border-top: 1px solid #E5DCD3; padding-top: 12px;">TirupatiBalajee Dresses Management System • Official Security Dispatch</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Welcome to TirupatiBalajee Dresses - Your Administrative Credentials",
      template: "USER_INVITATION",
      htmlContent,
      metadata: { username, role, recipientName: name },
    });
  }

  /**
   * Template 2: Password Reset Email with Secure Token
   */
  async sendPasswordReset(params: {
    name: string;
    email: string;
    resetToken: string;
    resetUrl?: string;
  }) {
    const { name, email, resetToken, resetUrl } = params;
    const finalResetUrl =
      resetUrl ||
      `http://localhost:3000/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(
        email
      )}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #FAF7F2; border: 1px solid #E5DCD3; border-radius: 16px;">
        <h2 style="color: #1C1917; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #44403C; font-size: 14px;">Hello <strong>${name || "User"}</strong>,</p>
        <p style="color: #44403C; font-size: 14px;">We received a request to reset your TirupatiBalajee Dresses account password. Click the button below to choose a new password.</p>
        
        <p style="text-align: center; margin: 26px 0;">
          <a href="${finalResetUrl}" style="background-color: #1C1917; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Reset My Password</a>
        </p>

        <div style="background-color: #F5EFEB; border: 1px solid #E5DCD3; padding: 12px; border-radius: 8px; font-size: 12px; color: #57534E;">
          ⏱️ This password reset link is valid for <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
        </div>

        <p style="color: #78716C; font-size: 11px; border-top: 1px solid #E5DCD3; padding-top: 12px; margin-top: 20px;">TirupatiBalajee Dresses Security Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "TirupatiBalajee Dresses - Password Reset Instructions",
      template: "PASSWORD_RESET",
      htmlContent,
      metadata: { resetToken, recipientEmail: email },
    });
  }

  /**
   * Template 3: Account Security Notification (Suspension / Password Change / Security Alert)
   */
  async sendSecurityAlert(params: {
    name: string;
    email: string;
    title: string;
    message: string;
  }) {
    const { name, email, title, message } = params;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #FAF7F2; border: 1px solid #E5DCD3; border-radius: 16px;">
        <h2 style="color: #B91C1C; margin-top: 0;">Security Alert: ${title}</h2>
        <p style="color: #44403C; font-size: 14px;">Hello <strong>${name || "User"}</strong>,</p>
        <p style="color: #44403C; font-size: 14px;">${message}</p>
        <p style="color: #78716C; font-size: 12px;">Timestamp: ${new Date().toUTCString()}</p>
        <p style="color: #78716C; font-size: 11px; border-top: 1px solid #E5DCD3; padding-top: 12px; margin-top: 20px;">TirupatiBalajee Dresses Security Alert System</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Security Alert: ${title}`,
      template: "SECURITY_ALERT",
      htmlContent,
      metadata: { title },
    });
  }
}

export const emailService = new EmailService();
