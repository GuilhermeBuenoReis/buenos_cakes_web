import { z } from "zod";
import { type BackendRouteOptions, requestBackend } from "../http-client";
import { addressSchema } from "../schemas/address";

export const createAddressRequestSchema = z.object({
	city: z.string().trim().min(1),
	complement: z.string().nullable().optional(),
	houseNumber: z.string().trim().min(1),
	isDefault: z.boolean().optional(),
	label: z.string().trim().min(1),
	recipientName: z.string().trim().min(1),
	reference: z.string().nullable().optional(),
	state: z.string().trim().min(1),
	street: z.string().trim().min(1),
	userId: z.string().min(1),
	zipCode: z.string().trim().min(1),
});

export const createAddressResponseSchema = z.object({
	address: addressSchema,
});

export type CreateAddressRequestInput = z.input<
	typeof createAddressRequestSchema
>;

export type CreateAddressResponse = z.infer<typeof createAddressResponseSchema>;

export async function createAddress(
	input: CreateAddressRequestInput,
	options: BackendRouteOptions = {},
): Promise<CreateAddressResponse> {
	const data = createAddressRequestSchema.parse(input);

	return requestBackend({
		data,
		method: "POST",
		headers: options.headers,
		responseSchema: createAddressResponseSchema,
		signal: options.signal,
		url: "/api/addresses/create",
	});
}
