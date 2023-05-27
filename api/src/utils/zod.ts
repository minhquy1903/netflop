import z from 'zod';

export const zPassword = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[a-zA-Z]/, 'Password must contain at least one character');
