import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const optionalNullableStringSchema = z.string().nullable().optional();

export const productFillingSchema = z.object({
	createdAt: dateTimeStringSchema,
	id: z.string(),
	isActive: z.boolean(),
	isDefault: z.boolean(),
	label: z.string(),
	priceDelta: z.number(),
	productId: z.string(),
	sortOrder: z.number(),
	updatedAt: optionalNullableStringSchema,
});

export type ApiProductFilling = z.infer<typeof productFillingSchema>;
