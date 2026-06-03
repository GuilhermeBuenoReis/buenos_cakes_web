import { z } from "zod";
import { requestBackend } from "../http-client";
import { userSchema } from "../schemas/user";

export const authenticateUserRequestSchema = z.object({
	email: z.email("Informe um e-mail válido."),
	password: z.string().trim().min(1, "Informe sua senha."),
});

export const authenticateUserResponseSchema = z.object({
	accessToken: z.string(),
	user: userSchema,
});

export type AuthenticateUserRequestInput = z.input<
	typeof authenticateUserRequestSchema
>;

export type AuthenticateUserResponse = z.infer<
	typeof authenticateUserResponseSchema
>;

interface AuthenticateUserOptions {
	signal?: AbortSignal;
}

export async function authenticateUser(
	input: AuthenticateUserRequestInput,
	options: AuthenticateUserOptions = {},
): Promise<AuthenticateUserResponse> {
	const data = authenticateUserRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "POST",
		responseSchema: authenticateUserResponseSchema,
		signal: options.signal,
		url: "/api/users/login",
	});
}
