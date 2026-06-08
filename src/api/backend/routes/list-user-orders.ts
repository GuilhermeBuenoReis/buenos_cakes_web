import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { orderSchema } from "../schemas/order";
import { paginationRequestSchema } from "../schemas/pagination";

export const listUserOrdersRequestSchema = paginationRequestSchema.extend({
	userId: z.string().min(1),
});

export const listUserOrdersResponseSchema = z.object({
	orders: z.array(orderSchema),
});

export type ListUserOrdersRequestInput = z.input<
	typeof listUserOrdersRequestSchema
>;

export type ListUserOrdersResponse = z.infer<
	typeof listUserOrdersResponseSchema
>;

export async function listUserOrders(
	input: ListUserOrdersRequestInput,
	options: BackendRouteOptions = {},
): Promise<ListUserOrdersResponse> {
	const { userId, ...params } = listUserOrdersRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		params,
		responseSchema: listUserOrdersResponseSchema,
		signal: options.signal,
		url: `/api/users/${userId}/orders`,
	});
}
