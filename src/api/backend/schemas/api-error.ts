import { z } from "zod";

export const apiErrorResponseSchema = z.object({
	message: z.string(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
