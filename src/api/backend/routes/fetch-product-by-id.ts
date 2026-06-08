import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { productSchema } from "../schemas/product";

export const fetchProductByIdRequestSchema = z.object({
	productId: z.string().min(1),
});

export const fetchProductByIdResponseSchema = z.object({
	product: productSchema,
});

export type FetchProductByIdRequestInput = z.input<
	typeof fetchProductByIdRequestSchema
>;

export type FetchProductByIdResponse = z.infer<
	typeof fetchProductByIdResponseSchema
>;

export async function fetchProductById(
	input: FetchProductByIdRequestInput,
	options: BackendRouteOptions = {},
): Promise<FetchProductByIdResponse> {
	const { productId } = fetchProductByIdRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		responseSchema: fetchProductByIdResponseSchema,
		signal: options.signal,
		url: `/api/products/${productId}`,
	});
}
