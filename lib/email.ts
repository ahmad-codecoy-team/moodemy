import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';


export async function sendPasswordResetOtpEmail(email: string, otp: string) {
  try {
    if (!resend) {
      console.warn('Resend API key not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your MoodyMe password reset code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your reset code</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6389FF 0%, #4755B6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Password Reset Code</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hello,</p>
              <p>Use the following 4-digit code to reset your MoodyMe password. This code will expire in 1 hour.</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="display:inline-block; font-size: 28px; letter-spacing: 4px; background: #fff; padding: 12px 20px; border-radius: 6px; border: 1px solid #e6e6e6;">${otp}</span>
              </div>
              <p>If you didn't request this code, you can safely ignore this message.</p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated email. Please do not reply.</p>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error };
  }
}
