import { Resend } from "resend";
import toast from "react-hot-toast";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerificationCode(to: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    toast.error('RESEND_API_KEY missing; skipping email send.');
    return;
  }
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Verify your email',
    html: `<p>Thanks for registering. Please verify your email by entering the code below:</p>
      <p>${code}</p>`
  });
}

export async function sendPasswordResetCodeEmail(to: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    toast.error('RESEND_API_KEY missing; skipping email send.');
    return;
  }
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Verify your identity',
    html: `<p>Thanks for registering. Please verify your email by entering the code below:</p>
      <p>${code}</p>`
  });
}

export async function sendPasswordReset(to: string, resetCode: string) {
  if (!process.env.RESEND_API_KEY) {
    toast.error('RESEND_API_KEY missing; skipping email send.');
    return;
  }
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Reset your password',
    html: `<p>We received a request to reset your password. Enter the code below:</p>
      <p>${resetCode}</p>`
  });
}
