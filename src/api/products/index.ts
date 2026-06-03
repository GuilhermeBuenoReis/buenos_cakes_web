import "server-only";

import { cache } from "react";
import { productsSeed } from "./seed";
import type {
	GetProductByIdRequest,
	GetProductByIdResponse,
	GetProductsRequest,
	GetProductsResponse,
	Product,
} from "./types";

export const getProducts = cache(
	async (_request: GetProductsRequest = {}): Promise<GetProductsResponse> =>
		productsSeed,
);

export const getProductById = cache(
	async ({ id }: GetProductByIdRequest): Promise<GetProductByIdResponse> =>
		productsSeed.find((product) => product.id === id) ?? null,
);

export function getProductIds(): Product["id"][] {
	return productsSeed.map((product) => product.id);
}
