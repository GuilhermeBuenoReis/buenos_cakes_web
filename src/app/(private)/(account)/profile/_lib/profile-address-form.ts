import { z } from "zod";
import type { ProfileAddress } from "./profile-content";

export const profileAddressSchema = z.object({
	city: z.string().trim().min(1, "Informe a cidade."),
	complement: z.string().trim(),
	houseNumber: z.string().trim().min(1, "Informe o número."),
	label: z.string().trim().min(1, "Informe o nome do endereço."),
	recipientName: z.string().trim().min(1, "Informe o destinatário."),
	reference: z.string().trim(),
	state: z
		.string()
		.trim()
		.min(1, "Informe o estado.")
		.max(2, "Use a sigla do estado."),
	street: z.string().trim().min(1, "Informe a rua."),
	zipCode: z.string().trim().min(1, "Informe o CEP."),
});

export type ProfileAddressFormValues = z.infer<typeof profileAddressSchema>;

export function toProfileAddressFormValues(
	address?: ProfileAddress,
): ProfileAddressFormValues {
	return {
		city: address?.city ?? "",
		complement: address?.complement ?? "",
		houseNumber: address?.houseNumber ?? "",
		label: address?.label ?? "",
		recipientName: address?.recipientName ?? "",
		reference: address?.reference ?? "",
		state: address?.state ?? "",
		street: address?.street ?? "",
		zipCode: address?.zipCode ?? "",
	};
}
