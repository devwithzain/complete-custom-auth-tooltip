import { authenticator } from 'otplib';

export function generateTOTPSecret(labelEmail: string) {
  const secret = authenticator.generateSecret();
  const issuer = 'NextAuthStarter';
  const label = encodeURIComponent(`${issuer}:${labelEmail}`);
  const otpauth = authenticator.keyuri(labelEmail, issuer, secret);
  return { secret, otpauth };
}

export function verifyTOTP(token: string, secret: string) {
  return authenticator.verify({ token, secret });
}
