import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const optionalNullableStringSchema = z.string().nullable().optional();

export const orderStatusSchema = z.enum([
	"pending",
	"confirmed",
	"preparing",
	"ready",
	"completed",
	"canceled",
]);

export const orderFulfillmentMethodSchema = z.enum(["pickup", "delivery"]);

export const orderSchema = z.object({
	createdAt: dateTimeStringSchema,
	customerNote: optionalNullableStringSchema,
	deliveryAddressId: optionalNullableStringSchema,
	deliveryFee: z.number(),
	fulfillmentMethod: orderFulfillmentMethodSchema,
	id: z.string(),
	pickupScheduledAt: optionalNullableStringSchema,
	status: orderStatusSchema,
	subtotal: z.number(),
	total: z.number(),
	updatedAt: optionalNullableStringSchema,
	userId: z.string(),
});

export type ApiOrder = z.infer<typeof orderSchema>;
export type ApiOrderStatus = z.infer<typeof orderStatusSchema>;
