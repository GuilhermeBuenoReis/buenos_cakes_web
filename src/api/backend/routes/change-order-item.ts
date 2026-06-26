import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderChangeResponseSchema } from "../schemas/order-change";

export const changeOrderItemRequestSchema = z.object({
	cancelUrl: z.url().optional(),
	customerEmail: z.email().nullable().optional(),
	note: z.string().nullable().optional(),
	orderId: z.string().min(1),
	orderItemId: z.string().min(1),
	productFillingId: z.string().nullable().optional(),
	productId: z.string().min(1),
	productSizeId: z.string().nullable().optional(),
	quantity: z.number().int().min(1),
	successUrl: z.url().optional(),
});

export const changeOrderItemResponseSchema = orderChangeResponseSchema;

export type ChangeOrderItemRequestInput = z.input<
	typeof changeOrderItemRequestSchema
>;

export type ChangeOrderItemResponse = z.infer<
	typeof changeOrderItemResponseSchema
>;

export async function changeOrderItem(
	input: ChangeOrderItemRequestInput,
	options: BackendRouteOptions = {},
): Promise<ChangeOrderItemResponse> {
	const { orderId, orderItemId, ...data } =
		changeOrderItemRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "PATCH",
		headers: options.headers,
		responseSchema: changeOrderItemResponseSchema,
		signal: options.signal,
		url: `/api/orders/${orderId}/items/${orderItemId}`,
	});
}
