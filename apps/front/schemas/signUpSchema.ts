import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .refine((email) => !email.endsWith('@gmail.com'), {
      message: 'Sign up using your college or organization email ',
    }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  gender: z.string().min(4, { message: 'Must Select' }),
});
