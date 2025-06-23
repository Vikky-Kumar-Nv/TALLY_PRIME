import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  financialYear: z.string().min(1, 'Financial year is required'),
  booksBeginningYear: z.string().min(1, 'Books beginning year is required'),
  address: z.string().optional(),
  pin: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  panNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UserInput = z.infer<typeof userSchema>;