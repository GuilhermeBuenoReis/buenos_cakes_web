import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { userSchema } from "../schemas/user";

export const updateUserRequestSchema = z.object({
	userId: z.string().min(1),
	name: z.string().trim().min(1).optional(),
	email: z.email().optional(),
	cpf: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
});

export const updateUserResponseSchema = z.object({
	user: userSchema,
});

export type UpdateUserRequestInput = z.input<typeof updateUserRequestSchema>;

export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>;

export async function updateUser(
	input: UpdateUserRequestInput,
	options: BackendRouteOptions = {},
): Promise<UpdateUserResponse> {
	const { userId, ...data } = updateUserRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "PATCH",
		headers: options.headers,
		responseSchema: updateUserResponseSchema,
		signal: options.signal,
		url: `/api/users/${userId}`,
	});
}
