import { productsSeed } from "@/api/products/seed";
import type { Product } from "@/api/products/types";
import type { CartSheetItemData } from "@/contexts/cart-sheet-context";

export const catalogProducts = productsSeed;

export function getCatalogProduct(productId: Product["id"]) {
	const product = catalogProducts.find((item) => item.id === productId);

	if (!product) {
		throw new Error(`Expected catalog product with id ${productId}.`);
	}

	return product;
}

export function createCartItemFromCatalog(
	productId: Product["id"],
	quantity = 1,
): CartSheetItemData {
	const product = getCatalogProduct(productId);

	return {
		highlight: product.category,
		id: product.id,
		image: product.image,
		name: product.name,
		quantity,
		unitPrice: product.price,
	};
}
