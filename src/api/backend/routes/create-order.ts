import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderFulfillmentMethodSchema, orderSchema } from "../schemas/order";

export const createOrderRequestSchema = z.object({
	customerNote: z.string().nullable().optional(),
	deliveryAddressId: z.string().nullable().optional(),
	deliveryFee: z.number().optional(),
	fulfillmentMethod: orderFulfillmentMethodSchema,
	pickupScheduledAt: z.string().nullable().optional(),
	subtotal: z.number(),
	total: z.number(),
	userId: z.string().min(1),
});

export const createOrderResponseSchema = z.object({
	order: orderSchema,
});

export type CreateOrderRequestInput = z.input<typeof createOrderRequestSchema>;

export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;

export async function createOrder(
	input: CreateOrderRequestInput,
	options: BackendRouteOptions = {},
): Promise<CreateOrderResponse> {
	const data = createOrderRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "POST",
		headers: options.headers,
		responseSchema: createOrderResponseSchema,
		signal: options.signal,
		url: "/api/orders/create",
	});
}
