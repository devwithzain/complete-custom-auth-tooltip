import * as z from "zod";

export const loginFormSchema = z.object({
   email: z.string().email({ message: 'Invalid email address' }),
   password: z.string().min(1, { message: 'Password is required' })
});

export const registerFormSchema = z.object({
   name: z.string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be at most 50 characters' }),
   email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
   password: z.string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one symbol' }),
});

export const emailSchema = z.object({
   email: z.string().email("Enter a valid email"),
});

export const codeSchema = z.object({
   code: z.string().length(6, "Code must be 6 digits").regex(/^\d{6}$/, "Code must contain only digits"),
});

export const resetPasswordSchema = z.object({
   password: z.string().min(6, "Password must be at least 6 characters"),
});

export const requestResetSchema = z.object({
   email: z.string().email()
});

export const emailVerifySchema = z.object({
   code: z.string().length(6, "Code must be 6 digits").regex(/^\d{6}$/, "Code must contain only digits"),
});

export type TcodeSchema = z.infer<typeof codeSchema>;
export type TEmailSchema = z.infer<typeof emailSchema>;
export type TloginFormData = z.infer<typeof loginFormSchema>;
export type TregisterFormData = z.infer<typeof registerFormSchema>;
export type TemailVerifyFormData = z.infer<typeof emailVerifySchema>;
export type TrequestResetFormData = z.infer<typeof requestResetSchema>;
export type TresetPasswordFormData = z.infer<typeof resetPasswordSchema>;
