import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderChangeResponseSchema } from "../schemas/order-change";

export const removeOrderItemRequestSchema = z.object({
	cancelUrl: z.url().optional(),
	customerEmail: z.email().nullable().optional(),
	orderId: z.string().min(1),
	orderItemId: z.string().min(1),
	successUrl: z.url().optional(),
});

export const removeOrderItemResponseSchema = orderChangeResponseSchema;

export type RemoveOrderItemRequestInput = z.input<
	typeof removeOrderItemRequestSchema
>;

export type RemoveOrderItemResponse = z.infer<
	typeof removeOrderItemResponseSchema
>;

export async function removeOrderItem(
	input: RemoveOrderItemRequestInput,
	options: BackendRouteOptions = {},
): Promise<RemoveOrderItemResponse> {
	const { orderId, orderItemId, ...data } =
		removeOrderItemRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "DELETE",
		headers: options.headers,
		responseSchema: removeOrderItemResponseSchema,
		signal: options.signal,
		url: `/api/orders/${orderId}/items/${orderItemId}`,
	});
}
