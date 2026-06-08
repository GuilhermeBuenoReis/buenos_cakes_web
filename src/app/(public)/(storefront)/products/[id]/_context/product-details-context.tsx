"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useMemo,
} from "react";
import type {
	Product,
	ProductFillingOption,
	ProductSizeOption,
} from "@/api/products/types";

const fallbackSizeOptions: ProductSizeOption[] = [
	{
		code: "pequeno",
		id: "pequeno",
		isDefault: true,
		label: "Pequeno",
		priceDelta: 0,
		servings: "Serve 4-6",
		sortOrder: 1,
	},
	{
		code: "medio",
		id: "medio",
		isDefault: false,
		label: "Medio",
		priceDelta: 0,
		servings: "Serve 8-10",
		sortOrder: 2,
	},
	{
		code: "grande",
		id: "grande",
		isDefault: false,
		label: "Grande",
		priceDelta: 0,
		servings: "Serve 12-15",
		sortOrder: 3,
	},
];

function clampQuantity(quantity: number) {
	return Math.max(1, quantity);
}

function clampMessage(message: string) {
	return message.slice(0, 50);
}

function getFallbackFillingsForCategory(
	category: string,
): ProductFillingOption[] {
	if (category === "Bolos") {
		return [
			"Creme de Baunilha (Padrao)",
			"Brigadeiro Cremoso",
			"Morango com Chantilly",
		].map(toFallbackFillingOption);
	}

	if (category === "Tortas") {
		return ["Creme Citrico (Padrao)", "Ganache Leve", "Frutas Vermelhas"].map(
			toFallbackFillingOption,
		);
	}

	if (category === "Cookies") {
		return ["Chocolate Intenso", "Doce de Leite", "Pistache"].map(
			toFallbackFillingOption,
		);
	}

	return ["Receita da Casa", "Chocolate Belga", "Baunilha Premium"].map(
		toFallbackFillingOption,
	);
}

function toFallbackFillingOption(
	label: string,
	index: number,
): ProductFillingOption {
	return {
		id: label,
		isDefault: index === 0,
		label,
		priceDelta: 0,
		sortOrder: index + 1,
	};
}

function getDefaultOptionId<TOption extends { id: string; isDefault: boolean }>(
	options: TOption[],
) {
	return options.find((option) => option.isDefault)?.id ?? options[0]?.id ?? "";
}

interface ProductDetailsContextValue {
	fillings: ProductFillingOption[];
	fullStars: number;
	message: string;
	product: Product;
	quantity: number;
	selectedFilling: ProductFillingOption;
	selectedFillingId: string;
	selectedSize: ProductSizeOption;
	selectedSizeId: string;
	selectedSizeLabel: string;
	selectedUnitPrice: number;
	setFilling: (nextFillingId: string) => void;
	setMessage: (nextMessage: string) => void;
	setQuantity: (nextQuantity: number) => void;
	setSize: (nextSizeId: string) => void;
	sizeOptions: ProductSizeOption[];
	thumbnailProducts: Product[];
}

const ProductDetailsContext = createContext<ProductDetailsContextValue | null>(
	null,
);

interface ProductDetailsProviderProps extends PropsWithChildren {
	product: Product;
	relatedImages: Product[];
}

export function ProductDetailsProvider({
	children,
	product,
	relatedImages,
}: ProductDetailsProviderProps) {
	const fillings = useMemo(() => {
		const productFillings = product.fillings ?? [];

		return productFillings.length > 0
			? productFillings
			: getFallbackFillingsForCategory(product.category);
	}, [product.category, product.fillings]);
	const sizeOptions = useMemo(() => {
		const productSizes = product.sizes ?? [];

		return productSizes.length > 0 ? productSizes : [...fallbackSizeOptions];
	}, [product.sizes]);
	const defaultFillingId = getDefaultOptionId(fillings);
	const defaultSizeId = getDefaultOptionId(sizeOptions);
	const [customization, setCustomization] = useQueryStates({
		filling: parseAsString.withDefault(defaultFillingId),
		message: parseAsString.withDefault(""),
		quantity: parseAsInteger.withDefault(1),
		size: parseAsString.withDefault(defaultSizeId),
	});

	const thumbnailProducts =
		relatedImages.length > 0 ? relatedImages : [product];
	const fullStars = Math.round(product.rating);
	const selectedSizeOption =
		sizeOptions.find((size) => size.id === customization.size) ??
		sizeOptions[0];
	const selectedFillingOption =
		fillings.find((filling) => filling.id === customization.filling) ??
		fillings[0];
	const quantity = clampQuantity(customization.quantity);
	const message = clampMessage(customization.message);
	const selectedUnitPrice =
		product.price +
		(selectedSizeOption?.priceDelta ?? 0) +
		(selectedFillingOption?.priceDelta ?? 0);

	function setSize(nextSizeId: string) {
		if (nextSizeId === customization.size) {
			return;
		}

		setCustomization({ size: nextSizeId });
	}

	function setFilling(nextFillingId: string) {
		if (nextFillingId === customization.filling) {
			return;
		}

		setCustomization({ filling: nextFillingId });
	}

	function setMessage(nextMessage: string) {
		const clampedMessage = clampMessage(nextMessage);

		if (clampedMessage === message) {
			return;
		}

		setCustomization({ message: clampedMessage });
	}

	function setQuantity(nextQuantity: number) {
		const clampedQuantity = clampQuantity(nextQuantity);

		if (clampedQuantity === quantity) {
			return;
		}

		setCustomization({ quantity: clampedQuantity });
	}

	const value: ProductDetailsContextValue = {
		fillings,
		fullStars,
		message,
		product,
		quantity,
		selectedFilling: selectedFillingOption,
		selectedFillingId: selectedFillingOption?.id ?? "",
		selectedSize: selectedSizeOption,
		selectedSizeId: selectedSizeOption?.id ?? "",
		selectedSizeLabel: selectedSizeOption?.label ?? "",
		selectedUnitPrice,
		setFilling,
		setMessage,
		setQuantity,
		setSize,
		sizeOptions,
		thumbnailProducts,
	};

	return (
		<ProductDetailsContext.Provider value={value}>
			{children}
		</ProductDetailsContext.Provider>
	);
}

export function useProductDetails() {
	const context = useContext(ProductDetailsContext);

	if (!context) {
		throw new Error(
			"useProductDetails must be used within ProductDetailsProvider.",
		);
	}

	return context;
}
