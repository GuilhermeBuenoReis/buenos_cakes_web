import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { productSizeSchema } from "../schemas/product-size";

export const listActiveProductSizesByProductRequestSchema = z.object({
	productId: z.string().min(1),
});

export const listActiveProductSizesByProductResponseSchema = z.object({
	productSizes: z.array(productSizeSchema),
});

export type ListActiveProductSizesByProductRequestInput = z.input<
	typeof listActiveProductSizesByProductRequestSchema
>;

export type ListActiveProductSizesByProductResponse = z.infer<
	typeof listActiveProductSizesByProductResponseSchema
>;

export async function listActiveProductSizesByProduct(
	input: ListActiveProductSizesByProductRequestInput,
	options: BackendRouteOptions = {},
): Promise<ListActiveProductSizesByProductResponse> {
	const { productId } =
		listActiveProductSizesByProductRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		responseSchema: listActiveProductSizesByProductResponseSchema,
		signal: options.signal,
		url: `/api/products/${productId}/sizes/active`,
	});
}
