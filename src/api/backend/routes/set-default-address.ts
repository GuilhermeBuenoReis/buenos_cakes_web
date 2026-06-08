import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { addressSchema } from "../schemas/address";

export const setDefaultAddressRequestSchema = z.object({
	addressId: z.string().min(1),
});

export const setDefaultAddressResponseSchema = z.object({
	address: addressSchema,
});

export type SetDefaultAddressRequestInput = z.input<
	typeof setDefaultAddressRequestSchema
>;

export type SetDefaultAddressResponse = z.infer<
	typeof setDefaultAddressResponseSchema
>;

export async function setDefaultAddress(
	input: SetDefaultAddressRequestInput,
	options: BackendRouteOptions = {},
): Promise<SetDefaultAddressResponse> {
	const { addressId } = setDefaultAddressRequestSchema.parse(input);

	return requestBackend({
		method: "POST",
		headers: options.headers,
		responseSchema: setDefaultAddressResponseSchema,
		signal: options.signal,
		url: `/api/addresses/${addressId}/default`,
	});
}
