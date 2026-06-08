import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";

export const deleteAddressRequestSchema = z.object({
	addressId: z.string().min(1),
});

export const deleteAddressResponseSchema = z.object({});

export type DeleteAddressRequestInput = z.input<
	typeof deleteAddressRequestSchema
>;

export async function deleteAddress(
	input: DeleteAddressRequestInput,
	options: BackendRouteOptions = {},
): Promise<void> {
	const { addressId } = deleteAddressRequestSchema.parse(input);

	await requestBackend({
		method: "POST",
		headers: options.headers,
		responseSchema: deleteAddressResponseSchema,
		signal: options.signal,
		url: `/api/addresses/delete/${addressId}`,
	});
}
