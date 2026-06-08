import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { paymentSchema } from "../schemas/payment";

export const createCheckoutPaymentRequestSchema = z.object({
	cancelUrl: z.url().optional(),
	customerEmail: z.email().nullable().optional(),
	orderId: z.string().min(1),
	successUrl: z.url().optional(),
});

export const createCheckoutPaymentResponseSchema = z.object({
	checkoutUrl: z.url(),
	payment: paymentSchema,
});

export type CreateCheckoutPaymentRequestInput = z.input<
	typeof createCheckoutPaymentRequestSchema
>;

export type CreateCheckoutPaymentResponse = z.infer<
	typeof createCheckoutPaymentResponseSchema
>;

export async function createCheckoutPayment(
	input: CreateCheckoutPaymentRequestInput,
	options: BackendRouteOptions = {},
): Promise<CreateCheckoutPaymentResponse> {
	const data = createCheckoutPaymentRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "POST",
		headers: options.headers,
		responseSchema: createCheckoutPaymentResponseSchema,
		signal: options.signal,
		url: "/api/payments/checkout",
	});
}
