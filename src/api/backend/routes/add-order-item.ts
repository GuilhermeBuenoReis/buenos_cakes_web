import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderChangeResponseSchema } from "../schemas/order-change";

export const addOrderItemRequestSchema = z.object({
	cancelUrl: z.url().optional(),
	customerEmail: z.email().nullable().optional(),
	note: z.string().nullable().optional(),
	orderId: z.string().min(1),
	productFillingId: z.string().nullable().optional(),
	productId: z.string().min(1),
	productSizeId: z.string().nullable().optional(),
	quantity: z.number().int().min(1),
	successUrl: z.url().optional(),
});

export const addOrderItemResponseSchema = orderChangeResponseSchema;

export type AddOrderItemRequestInput = z.input<
	typeof addOrderItemRequestSchema
>;

export type AddOrderItemResponse = z.infer<typeof addOrderItemResponseSchema>;

export async function addOrderItem(
	input: AddOrderItemRequestInput,
	options: BackendRouteOptions = {},
): Promise<AddOrderItemResponse> {
	const { orderId, ...data } = addOrderItemRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "POST",
		headers: options.headers,
		responseSchema: addOrderItemResponseSchema,
		signal: options.signal,
		url: `/api/orders/${orderId}/items`,
	});
}
