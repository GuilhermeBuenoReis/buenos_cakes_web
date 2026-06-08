import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { addressSchema } from "../schemas/address";

export const updateAddressRequestSchema = z.object({
	addressId: z.string().min(1),
	city: z.string().trim().min(1).optional(),
	complement: z.string().nullable().optional(),
	houseNumber: z.string().trim().min(1).optional(),
	isDefault: z.boolean().optional(),
	label: z.string().trim().min(1).optional(),
	recipientName: z.string().trim().min(1).optional(),
	reference: z.string().nullable().optional(),
	state: z.string().trim().min(1).optional(),
	street: z.string().trim().min(1).optional(),
	zipCode: z.string().trim().min(1).optional(),
});

export const updateAddressResponseSchema = z.object({
	address: addressSchema,
});

export type UpdateAddressRequestInput = z.input<
	typeof updateAddressRequestSchema
>;

export type UpdateAddressResponse = z.infer<typeof updateAddressResponseSchema>;

export async function updateAddress(
	input: UpdateAddressRequestInput,
	options: BackendRouteOptions = {},
): Promise<UpdateAddressResponse> {
	const { addressId, ...data } = updateAddressRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "PATCH",
		headers: options.headers,
		responseSchema: updateAddressResponseSchema,
		signal: options.signal,
		url: `/api/addresses/${addressId}`,
	});
}
