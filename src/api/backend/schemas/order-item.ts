import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const optionalNullableStringSchema = z.string().nullable().optional();

export const orderItemSchema = z.object({
	createdAt: dateTimeStringSchema,
	id: z.string(),
	note: optionalNullableStringSchema,
	orderId: z.string(),
	productFillingId: optionalNullableStringSchema,
	productId: z.string(),
	productSizeId: optionalNullableStringSchema,
	quantity: z.number().int(),
	total: z.number(),
	unitPrice: z.number(),
	updatedAt: optionalNullableStringSchema,
});

export type ApiOrderItem = z.infer<typeof orderItemSchema>;
