import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import appConfig from "../config/app-config";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      MailtrapTransport({
        token: appConfig.MAILTRAP_TOKEN,
        testInboxId: appConfig.MAILTRAP_INBOX_ID,
      })
    );
  }

  async sendEmail(to: string | string[], subject: string, text: string, html?: string) {
    const mailOptions = {
      from: {
        name: appConfig.MAILTRAP_SENDER_NAME,
        address: appConfig.MAILTRAP_SENDER_EMAIL,
      },
      to,
      subject,
      text,
      html,
      category: "Application Email",
      sandbox: true
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }
  }

  async sendWelcomeEmail(name: string, email: string, actionLink: string) {
    const subject = "Welcome to Our Application";
    const text = `Hello ${name},

Follow this link to verify your email address.

${actionLink}

If you didn't ask to verify this address, you can ignore this email.

Thanks,

Your Application Team`;

    const html = `<p>Hello ${name},</p>
<p>Follow this link to verify your email address.</p>
<p><a href="${actionLink}">${actionLink}</a></p>
<p>If you didn't ask to verify this address, you can ignore this email.</p>
<p>Thanks,</p>
<p>Your Application Team</p>`;

    return this.sendEmail(email, subject, text, html);
  }

  async sendPasswordResetEmail(email: string, actionLink: string) {
    const subject = "Reset your password";
    const text = `Hello,

Follow this link to reset your password.

${actionLink}

If you didn't ask to reset your password, you can ignore this email.

Thanks,

Your Application Team`;

    const html = `<p>Hello,</p>
<p>Follow this link to reset your password.</p>
<p><a href="${actionLink}">${actionLink}</a></p>
<p>If you didn't ask to reset your password, you can ignore this email.</p>
<p>Thanks,</p>
<p>Your Application Team</p>`;

    return this.sendEmail(email, subject, text, html);
  }
}

export const emailService = new EmailService();