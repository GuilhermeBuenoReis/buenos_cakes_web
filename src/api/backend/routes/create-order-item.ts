import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderItemSchema } from "../schemas/order-item";

export const createOrderItemRequestSchema = z.object({
	note: z.string().nullable().optional(),
	orderId: z.string().min(1),
	productFillingId: z.string().nullable().optional(),
	productId: z.string().min(1),
	productSizeId: z.string().nullable().optional(),
	quantity: z.number().int().min(1),
	total: z.number(),
	unitPrice: z.number(),
});

export const createOrderItemResponseSchema = z.object({
	orderItem: orderItemSchema,
});

export type CreateOrderItemRequestInput = z.input<
	typeof createOrderItemRequestSchema
>;

export type CreateOrderItemResponse = z.infer<
	typeof createOrderItemResponseSchema
>;

export async function createOrderItem(
	input: CreateOrderItemRequestInput,
	options: BackendRouteOptions = {},
): Promise<CreateOrderItemResponse> {
	const data = createOrderItemRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "POST",
		headers: options.headers,
		responseSchema: createOrderItemResponseSchema,
		signal: options.signal,
		url: "/api/order-items/create",
	});
}
