import { z } from 'zod';

export const pet = z.object({
  id: z.number(),
  name: z.string(),
  tag: z.string().optional(),
});

export type Pet = z.infer<typeof pet>;
