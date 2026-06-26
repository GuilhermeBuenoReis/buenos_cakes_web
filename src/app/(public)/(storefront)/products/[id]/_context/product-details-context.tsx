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

function clampQuantity(quantity: number) {
	return Math.max(1, quantity);
}

function clampMessage(message: string) {
	return message.slice(0, 50);
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
	selectedFilling: ProductFillingOption | null;
	selectedFillingId: string;
	selectedFillingLabel: string;
	selectedSize: ProductSizeOption | null;
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
	const fillings = useMemo(() => product.fillings ?? [], [product.fillings]);
	const sizeOptions = useMemo(() => product.sizes ?? [], [product.sizes]);
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
		sizeOptions[0] ??
		null;
	const selectedFillingOption =
		fillings.find((filling) => filling.id === customization.filling) ??
		fillings[0] ??
		null;
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
		selectedFillingLabel: selectedFillingOption?.label ?? "",
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
