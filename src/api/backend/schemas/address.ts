import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const optionalNullableStringSchema = z.string().nullable().optional();

export const addressSchema = z.object({
	city: z.string(),
	complement: optionalNullableStringSchema,
	createdAt: dateTimeStringSchema,
	houseNumber: z.string(),
	id: z.string(),
	isDefault: z.boolean(),
	label: z.string(),
	recipientName: z.string(),
	reference: optionalNullableStringSchema,
	state: z.string(),
	street: z.string(),
	updatedAt: optionalNullableStringSchema,
	userId: z.string(),
	zipCode: z.string(),
});

export type ApiAddress = z.infer<typeof addressSchema>;
