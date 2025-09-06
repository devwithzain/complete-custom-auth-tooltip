import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerificationCode(to: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Email configuration missing');
  }

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Verify your email',
      html: `<p>Thanks for registering. Please verify your email by entering the code below:</p>
        <p><strong style="font-size: 24px; letter-spacing: 2px;">${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>`
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function sendPasswordResetCodeEmail(to: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Email configuration missing');
  }

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Password Reset Verification',
      html: `<p>We received a request to reset your password. Please verify your identity by entering the code below:</p>
        <p><strong style="font-size: 24px; letter-spacing: 2px;">${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>`
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function sendPasswordReset(to: string, resetCode: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Email configuration missing');
  }

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Reset your password',
      html: `<p>We received a request to reset your password. Enter the code below:</p>
        <p><strong style="font-size: 24px; letter-spacing: 2px;">${resetCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>`
    });
    return result;
  } catch (error) {
    throw error;
  }
}
