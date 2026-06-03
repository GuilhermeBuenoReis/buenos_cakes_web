import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const nullableStringSchema = z.string().nullable();
const optionalNullableStringSchema = nullableStringSchema.optional();

export const productSchema = z.object({
	basePrice: z.number(),
	categoryId: z.string(),
	coverImageUrl: optionalNullableStringSchema,
	createdAt: dateTimeStringSchema,
	description: optionalNullableStringSchema,
	id: z.string(),
	isActive: z.boolean(),
	name: z.string(),
	popularityScore: z.number(),
	ratingAvg: z.number(),
	reviewsCount: z.number(),
	slug: z.string(),
	updatedAt: optionalNullableStringSchema,
});

export type ApiProduct = z.infer<typeof productSchema>;
