"use client";

import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useMemo,
} from "react";
import type { Product } from "@/api/products/types";

interface SidebarCategory {
	count: number;
	label: string;
}

export type SortValue = "popular" | "price-asc" | "price-desc" | "rating";

export const SORT_OPTIONS = [
	{ label: "Mais Populares", value: "popular" },
	{ label: "Menor Preço", value: "price-asc" },
	{ label: "Maior Preço", value: "price-desc" },
	{ label: "Melhor Avaliados", value: "rating" },
] as const;

const SORT_VALUES: SortValue[] = SORT_OPTIONS.map(
	(option) => option.value as SortValue,
);

const ITEMS_PER_PAGE = 8;

interface ProductsCatalogContextValue {
	categories: SidebarCategory[];
	paginatedProducts: Product[];
	sortOptions: readonly (typeof SORT_OPTIONS)[number][];
	currentPage: number;
	maxPrice: number;
	rating: number;
	selectedCategory: string;
	shownCount: number;
	sortValue: SortValue;
	totalPages: number;
	totalProducts: number;
	setCurrentPage: (nextPage: number) => void;
	setMaxPrice: (nextValue: number) => void;
	setRating: (nextValue: number) => void;
	setSelectedCategory: (nextCategory: string) => void;
	setSortValue: (nextSort: SortValue) => void;
}

const ProductsCatalogContext =
	createContext<ProductsCatalogContextValue | null>(null);

interface ProductsCatalogProviderProps extends PropsWithChildren {
	products: Product[];
}

export function ProductsCatalogProvider({
	children,
	products,
}: ProductsCatalogProviderProps) {
	const categories = useMemo<SidebarCategory[]>(() => {
		const counts = new Map<string, number>();

		for (const product of products) {
			counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
		}

		return [
			{ count: products.length, label: "Todos" },
			...Array.from(counts, ([label, count]) => ({ count, label })),
		];
	}, [products]);

	const categoryOptions = useMemo(
		() => categories.map((category) => category.label),
		[categories],
	);

	const [sortValue, setSortValue] = useQueryState(
		"sort",
		parseAsStringEnum<SortValue>(SORT_VALUES).withDefault("popular"),
	);
	const [currentPage, setCurrentPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1),
	);
	const [selectedCategory, setSelectedCategory] = useQueryState(
		"category",
		parseAsStringEnum(categoryOptions).withDefault("Todos"),
	);
	const [maxPrice, setMaxPrice] = useQueryState(
		"maxPrice",
		parseAsInteger.withDefault(250),
	);
	const [rating, setRating] = useQueryState(
		"rating",
		parseAsInteger.withDefault(4),
	);

	const filteredProducts = useMemo(() => {
		const filtered = products.filter((product) => {
			const matchesCategory =
				selectedCategory === "Todos" || product.category === selectedCategory;
			const matchesPrice = product.price <= maxPrice;
			const matchesRating = product.reviews === 0 || product.rating >= rating;

			return matchesCategory && matchesPrice && matchesRating;
		});

		return filtered.sort((a, b) => {
			if (sortValue === "price-asc") return a.price - b.price;
			if (sortValue === "price-desc") return b.price - a.price;
			if (sortValue === "rating") return b.rating - a.rating;
			return b.popularity - a.popularity;
		});
	}, [maxPrice, products, rating, selectedCategory, sortValue]);

	const totalProducts = filteredProducts.length;
	const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
	const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
	const initialIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
	const paginatedProducts = filteredProducts.slice(
		initialIndex,
		initialIndex + ITEMS_PER_PAGE,
	);

	const value = useMemo<ProductsCatalogContextValue>(
		() => ({
			categories,
			currentPage: safeCurrentPage,
			maxPrice,
			paginatedProducts,
			rating,
			selectedCategory,
			setCurrentPage,
			setMaxPrice,
			setRating,
			setSelectedCategory,
			setSortValue,
			shownCount: paginatedProducts.length,
			sortOptions: SORT_OPTIONS,
			sortValue,
			totalPages,
			totalProducts,
		}),
		[
			categories,
			maxPrice,
			paginatedProducts,
			rating,
			selectedCategory,
			setCurrentPage,
			setMaxPrice,
			setRating,
			setSelectedCategory,
			setSortValue,
			sortValue,
			safeCurrentPage,
			totalPages,
			totalProducts,
		],
	);

	return (
		<ProductsCatalogContext.Provider value={value}>
			{children}
		</ProductsCatalogContext.Provider>
	);
}

export function useProductsCatalog() {
	const context = useContext(ProductsCatalogContext);

	if (!context) {
		throw new Error(
			"useProductsCatalog must be used within ProductsCatalogProvider.",
		);
	}

	return context;
}
