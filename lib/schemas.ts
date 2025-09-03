import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(50).optional().or(z.literal('')),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'At least one uppercase letter')
    .regex(/[a-z]/, 'At least one lowercase letter')
    .regex(/[0-9]/, 'At least one number')
    .regex(/[^A-Za-z0-9]/, 'At least one symbol'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const requestResetSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8)
});

export const totpVerifySchema = z.object({
  code: z.string().min(6).max(6)
});
