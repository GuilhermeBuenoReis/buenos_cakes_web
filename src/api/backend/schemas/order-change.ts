import { z } from "zod";
import { orderSchema } from "./order";
import { paymentSchema } from "./payment";

const optionalNullableStringSchema = z.string().nullable().optional();

export const orderChangeStatusSchema = z.enum([
	"applied",
	"requires_additional_payment",
	"refund_required",
]);

export const orderAdjustmentTypeSchema = z.enum([
	"additional_payment",
	"refund",
]);

export const orderAdjustmentStatusSchema = z.enum([
	"pending",
	"confirmed",
	"canceled",
]);

export const orderAdjustmentSchema = z.object({
	amount: z.number().optional(),
	createdAt: optionalNullableStringSchema,
	currency: optionalNullableStringSchema,
	id: z.string().optional(),
	status: orderAdjustmentStatusSchema,
	type: orderAdjustmentTypeSchema,
	updatedAt: optionalNullableStringSchema,
});

export const orderChangeSchema = z.object({
	adjustment: orderAdjustmentSchema.nullable().optional().catch(undefined),
	checkoutUrl: optionalNullableStringSchema,
	difference: z.coerce.number().catch(0),
	newTotal: z.coerce.number().catch(0),
	payment: paymentSchema.nullable().optional().catch(undefined),
	previousTotal: z.coerce.number().catch(0),
	status: orderChangeStatusSchema,
});

export const orderChangeResponseSchema = z.object({
	change: orderChangeSchema,
	order: orderSchema.optional().catch(undefined),
});

export type OrderChangeStatus = z.infer<typeof orderChangeStatusSchema>;
export type OrderAdjustmentType = z.infer<typeof orderAdjustmentTypeSchema>;
export type OrderAdjustmentStatus = z.infer<typeof orderAdjustmentStatusSchema>;
export type ApiOrderAdjustment = z.infer<typeof orderAdjustmentSchema>;
export type ApiOrderChange = z.infer<typeof orderChangeSchema>;
export type OrderChangeResponse = z.infer<typeof orderChangeResponseSchema>;
