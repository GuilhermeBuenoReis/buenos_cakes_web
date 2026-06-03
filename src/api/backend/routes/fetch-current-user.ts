import { z } from "zod";
import { requestBackend } from "../http-client";
import { userSchema } from "../schemas/user";

export const fetchCurrentUserResponseSchema = z.object({
	user: userSchema,
});

export type FetchCurrentUserResponse = z.infer<
	typeof fetchCurrentUserResponseSchema
>;

interface FetchCurrentUserOptions {
	signal?: AbortSignal;
}

export async function fetchCurrentUser(
	options: FetchCurrentUserOptions = {},
): Promise<FetchCurrentUserResponse> {
	return requestBackend({
		method: "GET",
		responseSchema: fetchCurrentUserResponseSchema,
		signal: options.signal,
		url: "/api/users/me",
	});
}
