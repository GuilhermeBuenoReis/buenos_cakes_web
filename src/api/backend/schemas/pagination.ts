import { z } from "zod";

export const paginationRequestSchema = z.object({
	page: z.coerce
		.number()
		.int()
		.positive()
		.max(Number.MAX_SAFE_INTEGER)
		.default(1),
});

export type PaginationRequestInput = z.input<typeof paginationRequestSchema>;
export type PaginationRequest = z.output<typeof paginationRequestSchema>;
