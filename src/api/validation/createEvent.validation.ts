import { z } from 'zod';

export const eventSchema = z.object({
    name: z.string(),
    amount: z.number(),
    size: z.enum(["small", "medium", "large"])
})

export const createEventValidation = z.array(eventSchema);

