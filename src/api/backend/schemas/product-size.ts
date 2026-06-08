import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const optionalNullableStringSchema = z.string().nullable().optional();

export const productSizeSchema = z.object({
	code: z.string(),
	createdAt: dateTimeStringSchema,
	id: z.string(),
	isActive: z.boolean(),
	isDefault: z.boolean(),
	label: z.string(),
	priceDelta: z.number(),
	productId: z.string(),
	servingsLabel: optionalNullableStringSchema,
	sortOrder: z.number(),
	updatedAt: optionalNullableStringSchema,
});

export type ApiProductSize = z.infer<typeof productSizeSchema>;
