import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { userSchema } from "../schemas/user";

export const fetchCurrentUserResponseSchema = z.object({
	user: userSchema,
});

export type FetchCurrentUserResponse = z.infer<
	typeof fetchCurrentUserResponseSchema
>;

export async function fetchCurrentUser(
	options: BackendRouteOptions = {},
): Promise<FetchCurrentUserResponse> {
	return requestBackend({
		method: "GET",
		headers: options.headers,
		responseSchema: fetchCurrentUserResponseSchema,
		signal: options.signal,
		url: "/api/users/me",
	});
}
