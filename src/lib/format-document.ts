export function formatCpfCnpj(value: string): string {
	const digits = value.replace(/\D/g, "");

	if (digits.length <= 11) {
		return digits
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
	}

	return digits
		.replace(/(\d{2})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1/$2")
		.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value: string): string {
	const digits = value.replace(/\D/g, "");

	if (digits.length <= 10) {
		return digits
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{4})(\d{1,4})$/, "$1-$2");
	}

	return digits
		.replace(/(\d{2})(\d)/, "($1) $2")
		.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function stripMask(value: string): string {
	return value.replace(/\D/g, "");
}
