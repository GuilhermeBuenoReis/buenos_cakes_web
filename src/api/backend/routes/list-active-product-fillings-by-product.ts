import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { productFillingSchema } from "../schemas/product-filling";

export const listActiveProductFillingsByProductRequestSchema = z.object({
	productId: z.string().min(1),
});

export const listActiveProductFillingsByProductResponseSchema = z.object({
	productFillings: z.array(productFillingSchema),
});

export type ListActiveProductFillingsByProductRequestInput = z.input<
	typeof listActiveProductFillingsByProductRequestSchema
>;

export type ListActiveProductFillingsByProductResponse = z.infer<
	typeof listActiveProductFillingsByProductResponseSchema
>;

export async function listActiveProductFillingsByProduct(
	input: ListActiveProductFillingsByProductRequestInput,
	options: BackendRouteOptions = {},
): Promise<ListActiveProductFillingsByProductResponse> {
	const { productId } =
		listActiveProductFillingsByProductRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		responseSchema: listActiveProductFillingsByProductResponseSchema,
		signal: options.signal,
		url: `/api/products/${productId}/fillings/active`,
	});
}
