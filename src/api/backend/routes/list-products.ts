import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { paginationRequestSchema } from "../schemas/pagination";
import { productSchema } from "../schemas/product";

export const listProductsRequestSchema = paginationRequestSchema;

export const listProductsResponseSchema = z.object({
	products: z.array(productSchema),
});

export type ListProductsRequestInput = z.input<
	typeof listProductsRequestSchema
>;

export type ListProductsResponse = z.infer<typeof listProductsResponseSchema>;

export async function listProducts(
	input: ListProductsRequestInput = {},
	options: BackendRouteOptions = {},
): Promise<ListProductsResponse> {
	const params = listProductsRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		params,
		responseSchema: listProductsResponseSchema,
		signal: options.signal,
		url: "/api/products",
	});
}
