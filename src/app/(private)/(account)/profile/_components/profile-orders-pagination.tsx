"use client";

import type { MouseEvent } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPaginationItems } from "@/lib/build-pagination-items";

interface ProfileOrdersPaginationProps {
	currentPage: number;
	onPageChange: (nextPage: number) => void;
	totalPages: number;
}

export function ProfileOrdersPagination({
	currentPage,
	onPageChange,
	totalPages,
}: ProfileOrdersPaginationProps) {
	const pageItems = buildPaginationItems(currentPage, totalPages);

	function handlePreviousPageClick(event: MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	}

	function handleNextPageClick(event: MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	}

	function handlePageItemClick(event: MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		const nextPage = Number(event.currentTarget.dataset.page);
		if (!Number.isFinite(nextPage)) {
			return;
		}

		onPageChange(nextPage);
	}

	return (
		<Pagination className="mt-6 justify-end">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						size="icon-sm"
						href="#"
						onClick={handlePreviousPageClick}
						className={`[&>span]:hidden ${
							currentPage === 1 ? "pointer-events-none opacity-40" : ""
						}`}
						aria-label="Página anterior"
					/>
				</PaginationItem>

				{pageItems.map((item, index) => (
					<PaginationItem key={`${item ?? "ellipsis"}-${index}`}>
						{item === null ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								href="#"
								data-page={item}
								isActive={item === currentPage}
								size="icon-sm"
								className={
									item === currentPage
										? "border-rose-500 bg-rose-500 text-white shadow-sm hover:bg-rose-500 hover:text-white"
										: "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50"
								}
								onClick={handlePageItemClick}
							>
								{item}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						size="icon-sm"
						href="#"
						onClick={handleNextPageClick}
						className={`[&>span]:hidden ${
							currentPage === totalPages ? "pointer-events-none opacity-40" : ""
						}`}
						aria-label="Próxima página"
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
