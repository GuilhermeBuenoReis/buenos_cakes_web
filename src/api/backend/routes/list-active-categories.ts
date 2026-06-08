import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { categorySchema } from "../schemas/category";
import { paginationRequestSchema } from "../schemas/pagination";

export const listActiveCategoriesRequestSchema = paginationRequestSchema;

export const listActiveCategoriesResponseSchema = z.object({
	categories: z.array(categorySchema),
});

export type ListActiveCategoriesRequestInput = z.input<
	typeof listActiveCategoriesRequestSchema
>;

export type ListActiveCategoriesResponse = z.infer<
	typeof listActiveCategoriesResponseSchema
>;

export async function listActiveCategories(
	input: ListActiveCategoriesRequestInput = {},
	options: BackendRouteOptions = {},
): Promise<ListActiveCategoriesResponse> {
	const params = listActiveCategoriesRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		params,
		responseSchema: listActiveCategoriesResponseSchema,
		signal: options.signal,
		url: "/api/categories/active",
	});
}
