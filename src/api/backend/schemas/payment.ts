import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const optionalNullableStringSchema = z.string().nullable().optional();

export const paymentSchema = z.object({
	amount: z.number(),
	canceledAt: optionalNullableStringSchema,
	createdAt: dateTimeStringSchema,
	currency: z.string(),
	expiresAt: optionalNullableStringSchema,
	failureReason: optionalNullableStringSchema,
	id: z.string(),
	method: z.enum(["pix", "credit_card", "debit_card", "cash"]).nullable(),
	orderId: z.string(),
	paidAt: optionalNullableStringSchema,
	pixQrCode: optionalNullableStringSchema,
	pixQrCodeUrl: optionalNullableStringSchema,
	provider: z.enum(["external", "manual"]),
	providerClientSecret: optionalNullableStringSchema,
	providerCustomerId: optionalNullableStringSchema,
	providerName: optionalNullableStringSchema,
	providerPaymentMethodId: optionalNullableStringSchema,
	providerReferenceId: optionalNullableStringSchema,
	providerSessionId: optionalNullableStringSchema,
	providerStatus: optionalNullableStringSchema,
	refundedAt: optionalNullableStringSchema,
	status: z.enum([
		"pending",
		"processing",
		"paid",
		"failed",
		"canceled",
		"refunded",
	]),
	updatedAt: optionalNullableStringSchema,
});

export type ApiPayment = z.infer<typeof paymentSchema>;
