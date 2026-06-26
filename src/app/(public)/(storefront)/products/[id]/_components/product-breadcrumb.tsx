"use client";

import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useProductDetails } from "../_context/product-details-context";

export function ProductBreadcrumb() {
	const { product, selectedSizeLabel } = useProductDetails();

	return (
		<Breadcrumb>
			<BreadcrumbList className="gap-1 text-xs text-rose-400 sm:text-sm">
				<BreadcrumbItem>
					<BreadcrumbLink asChild className="text-rose-400 hover:text-rose-500">
						<Link href="/">Inicio</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className="text-rose-300" />
				<BreadcrumbItem>
					<BreadcrumbLink asChild className="text-rose-400 hover:text-rose-500">
						<Link href="/products">{product.category}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className="text-rose-300" />
				<BreadcrumbItem>
					<BreadcrumbPage className="font-semibold text-rose-500">
						{selectedSizeLabel
							? `${product.name} - ${selectedSizeLabel}`
							: product.name}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
