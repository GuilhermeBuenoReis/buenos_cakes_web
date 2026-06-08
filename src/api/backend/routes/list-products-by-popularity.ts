import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { paginationRequestSchema } from "../schemas/pagination";
import { productSchema } from "../schemas/product";

export const listProductsByPopularityRequestSchema = paginationRequestSchema;

export const listProductsByPopularityResponseSchema = z.object({
	products: z.array(productSchema),
});

export type ListProductsByPopularityRequestInput = z.input<
	typeof listProductsByPopularityRequestSchema
>;

export type ListProductsByPopularityResponse = z.infer<
	typeof listProductsByPopularityResponseSchema
>;

export async function listProductsByPopularity(
	input: ListProductsByPopularityRequestInput = {},
	options: BackendRouteOptions = {},
): Promise<ListProductsByPopularityResponse> {
	const params = listProductsByPopularityRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		params,
		responseSchema: listProductsByPopularityResponseSchema,
		signal: options.signal,
		url: "/api/products/popularity",
	});
}
