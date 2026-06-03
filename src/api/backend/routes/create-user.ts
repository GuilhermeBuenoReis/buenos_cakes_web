import { z } from "zod";
import { requestBackend } from "../http-client";
import { userSchema } from "../schemas/user";

export const createUserRequestSchema = z.object({
	email: z.email("Informe um e-mail válido."),
	name: z.string().trim().min(1, "Informe seu nome completo."),
	password: z
		.string()
		.trim()
		.min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const createUserResponseSchema = z.object({
	user: userSchema,
});

export type CreateUserRequestInput = z.input<typeof createUserRequestSchema>;

export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;

interface CreateUserOptions {
	signal?: AbortSignal;
}

export async function createUser(
	input: CreateUserRequestInput,
	options: CreateUserOptions = {},
): Promise<CreateUserResponse> {
	const data = createUserRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "POST",
		responseSchema: createUserResponseSchema,
		signal: options.signal,
		url: "/api/users/create",
	});
}
