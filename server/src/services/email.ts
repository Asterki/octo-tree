import nodemailer from 'nodemailer';

class EmailService {
	private static instance: EmailService;
	private transporters: { [key: string]: nodemailer.Transporter };

	private constructor() {
		this.transporters = {
			security: nodemailer.createTransport({
				host: process.env.EMAIL_SECURITY_HOST as string,
				port: parseInt(process.env.EMAIL_SECURITY_PORT as string),
				secure: process.env.EMAIL_SECURITY_SECURE === 'true',
				auth: {
					user: process.env.EMAIL_SECURITY_USER as string,
					pass: process.env.EMAIL_SECURITY_PASS as string,
				},
			}),
		};
	}

	public static getInstance(): EmailService {
		if (!EmailService.instance) {
			EmailService.instance = new EmailService();
		}
		return EmailService.instance;
	}

	public async sendEmail(
		subject: string,
		html: string,
		to: string,
		transporter: 'security' = 'security',
	) {
		try {
			await this.transporters[transporter].sendMail({
				from: `"Octo-Tree" <${process.env.EMAIL_SECURITY_USER}>`,
				to: to,
				subject: subject,
				html: html,
			});
			console.log(`Email sent to ${to} via ${transporter} transporter.`);
		} catch (error) {
			console.error(`Error sending email: ${error}`);
		}
	}
}

export default EmailService;
