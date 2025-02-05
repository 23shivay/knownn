import { z } from 'zod'

export const signInSchema = z.object({
  name: z.string(),
 
});