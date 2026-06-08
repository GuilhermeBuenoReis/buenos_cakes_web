import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderSchema } from "../schemas/order";

export const fetchOrderByIdRequestSchema = z.object({
	orderId: z.string().min(1),
});

export const fetchOrderByIdResponseSchema = z.object({
	order: orderSchema,
});

export type FetchOrderByIdRequestInput = z.input<
	typeof fetchOrderByIdRequestSchema
>;

export type FetchOrderByIdResponse = z.infer<
	typeof fetchOrderByIdResponseSchema
>;

export async function fetchOrderById(
	input: FetchOrderByIdRequestInput,
	options: BackendRouteOptions = {},
): Promise<FetchOrderByIdResponse> {
	const { orderId } = fetchOrderByIdRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		responseSchema: fetchOrderByIdResponseSchema,
		signal: options.signal,
		url: `/api/orders/${orderId}`,
	});
}
