import { z } from 'zod';

export const PROMPT = z.object({
    prompt: z.string().min(1, "Prompt is required").max(1000),
});
