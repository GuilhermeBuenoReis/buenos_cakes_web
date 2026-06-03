import { z } from "zod";
import { requestBackend } from "../http-client";
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

interface ListProductsByPopularityOptions {
	signal?: AbortSignal;
}

export async function listProductsByPopularity(
	input: ListProductsByPopularityRequestInput = {},
	options: ListProductsByPopularityOptions = {},
): Promise<ListProductsByPopularityResponse> {
	const params = listProductsByPopularityRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		params,
		responseSchema: listProductsByPopularityResponseSchema,
		signal: options.signal,
		url: "/api/products/popularity",
	});
}
