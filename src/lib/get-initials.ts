export function getInitials(name: string) {
	const parts = name
		.split(" ")
		.map((part) => part.trim())
		.filter(Boolean);

	if (parts.length === 0) {
		return "";
	}

	const firstName = parts[0];
	const lastName = parts.length > 1 ? parts[parts.length - 1] : "";

	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
