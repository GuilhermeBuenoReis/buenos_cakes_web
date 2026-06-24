"use client";

import { useCartSheet } from "@/contexts/cart-sheet-context";
import { useProductDetails } from "../_context/product-details-context";

export function useAddProductToCart() {
	const { addItem } = useCartSheet();
	const {
		message,
		product,
		quantity,
		selectedFilling,
		selectedFillingId,
		selectedSizeId,
		selectedSizeLabel,
		selectedUnitPrice,
	} = useProductDetails();

	function addProductToCart() {
		const trimmedMessage = message.trim();
		const highlightParts = [selectedSizeLabel, selectedFilling.label];

		if (trimmedMessage) {
			highlightParts.push("Com mensagem");
		}

		addItem({
			highlight: highlightParts.join(" • "),
			id: [product.id, selectedSizeId, selectedFillingId, trimmedMessage]
				.filter(Boolean)
				.join("::"),
			image: product.image,
			name: product.name,
			note: trimmedMessage || null,
			productFillingId: selectedFillingId || null,
			productId: product.id,
			productSizeId: selectedSizeId || null,
			quantity,
			unitPrice: selectedUnitPrice,
		});
	}

	return { addProductToCart };
}
