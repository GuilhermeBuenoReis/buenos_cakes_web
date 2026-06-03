import { z } from "zod";

const dateTimeStringSchema = z.string().min(1);
const nullableStringSchema = z.string().nullable();
const optionalNullableStringSchema = nullableStringSchema.optional();

export const userSchema = z.object({
	cpf: optionalNullableStringSchema,
	createdAt: dateTimeStringSchema,
	email: z.email(),
	id: z.string(),
	name: z.string(),
	phone: optionalNullableStringSchema,
	role: z.enum(["customer", "admin"]),
	updatedAt: optionalNullableStringSchema,
});

export type ApiUser = z.infer<typeof userSchema>;
