export function buildPaginationItems(currentPage: number, totalPages: number) {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	if (currentPage <= 3) {
		return [1, 2, 3, null, totalPages - 1, totalPages];
	}

	if (currentPage >= totalPages - 2) {
		return [1, 2, null, totalPages - 2, totalPages - 1, totalPages];
	}

	return [
		1,
		null,
		currentPage - 1,
		currentPage,
		currentPage + 1,
		null,
		totalPages,
	];
}
