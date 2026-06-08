import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { addressSchema } from "../schemas/address";

export const listUserAddressesRequestSchema = z.object({
	userId: z.string().min(1),
});

export const listUserAddressesResponseSchema = z.object({
	addresses: z.array(addressSchema),
});

export type ListUserAddressesRequestInput = z.input<
	typeof listUserAddressesRequestSchema
>;

export type ListUserAddressesResponse = z.infer<
	typeof listUserAddressesResponseSchema
>;

export async function listUserAddresses(
	input: ListUserAddressesRequestInput,
	options: BackendRouteOptions = {},
): Promise<ListUserAddressesResponse> {
	const { userId } = listUserAddressesRequestSchema.parse(input);

	return requestBackend({
		method: "GET",
		headers: options.headers,
		responseSchema: listUserAddressesResponseSchema,
		signal: options.signal,
		url: `/api/users/${userId}/addresses`,
	});
}
