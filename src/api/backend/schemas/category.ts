import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const nullableStringSchema = z.string().nullable();
const optionalNullableStringSchema = nullableStringSchema.optional();

export const categorySchema = z.object({
	createdAt: dateTimeStringSchema,
	description: optionalNullableStringSchema,
	id: z.string(),
	imageUrl: optionalNullableStringSchema,
	isActive: z.boolean(),
	name: z.string(),
	slug: z.string(),
	updatedAt: optionalNullableStringSchema,
});

export type ApiCategory = z.infer<typeof categorySchema>;
