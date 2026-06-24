import { z } from "zod";
import { formatCpfCnpj, formatPhone } from "@/lib/format-document";
import type { ProfileCustomer } from "./profile-content";

export const profileEditSchema = z.object({
	cpf: z.string(),
	email: z.email("Informe um e-mail válido."),
	name: z.string().trim().min(1, "Informe seu nome completo."),
	phone: z.string(),
});

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

const notInformedLabel = "Não informado";

export function toProfileEditFormValues(
	customer: ProfileCustomer,
): ProfileEditFormValues {
	const rawCpf = customer.cpf === notInformedLabel ? "" : customer.cpf;
	const rawPhone = customer.phone === notInformedLabel ? "" : customer.phone;

	return {
		cpf: rawCpf ? formatCpfCnpj(rawCpf) : "",
		email: customer.email,
		name: customer.fullName,
		phone: rawPhone ? formatPhone(rawPhone) : "",
	};
}
