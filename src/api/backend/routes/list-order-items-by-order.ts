import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderItemSchema } from "../schemas/order-item";

export const listOrderItemsByOrderRequestSchema = z.object({
	orderId: z.string().min(1),
});

export const listOrderItemsByOrderResponseSchema = z.object({
	orderItems: z.array(orderItemSchema),
});

export type ListOrderItemsByOrderRequestInput = z.input<
	typeof listOrderItemsByOrderRequestSchema
>;

export type ListOrderItemsByOrderResponse = z.infer<
	typeof listOrderItemsByOrderResponseSchema
>;

export async function listOrderItemsByOrder(
	input: ListOrderItemsByOrderRequestInput,
	options: BackendRouteOptions = {},
): Promise<ListOrderItemsByOrderResponse> {
	const { orderId } = listOrderItemsByOrderRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		responseSchema: listOrderItemsByOrderResponseSchema,
		signal: options.signal,
		url: `/api/orders/${orderId}/items`,
	});
}
