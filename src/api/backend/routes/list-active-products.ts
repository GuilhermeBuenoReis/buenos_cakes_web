import { z } from "zod";
import { requestBackend } from "../http-client";
import { paginationRequestSchema } from "../schemas/pagination";
import { productSchema } from "../schemas/product";

export const listActiveProductsRequestSchema = paginationRequestSchema;

export const listActiveProductsResponseSchema = z.object({
	products: z.array(productSchema),
});

export type ListActiveProductsRequestInput = z.input<
	typeof listActiveProductsRequestSchema
>;

export type ListActiveProductsResponse = z.infer<
	typeof listActiveProductsResponseSchema
>;

interface ListActiveProductsOptions {
	signal?: AbortSignal;
}

export async function listActiveProducts(
	input: ListActiveProductsRequestInput = {},
	options: ListActiveProductsOptions = {},
): Promise<ListActiveProductsResponse> {
	const params = listActiveProductsRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		params,
		responseSchema: listActiveProductsResponseSchema,
		signal: options.signal,
		url: "/api/products/active",
	});
}
