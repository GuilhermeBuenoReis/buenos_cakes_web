import { queryOptions } from "@tanstack/react-query";
import type { BackendRouteOptions } from "@/api/backend/http-client";
import { fetchProductById } from "@/api/backend/routes/fetch-product-by-id";
import { listOrderItemsByOrder } from "@/api/backend/routes/list-order-items-by-order";

export interface OrderDetailItem {
	id: string;
	note?: string | null;
	productFillingId?: string | null;
	productId: string;
	productName: string;
	productSizeId?: string | null;
	quantity: number;
	total: number;
	unitPrice: number;
}

export const profileOrderQueryKeys = {
	all: ["profile", "orders"] as const,
	detail: (orderId: string) => [...profileOrderQueryKeys.all, orderId] as const,
	items: (orderId: string) =>
		[...profileOrderQueryKeys.all, orderId, "items"] as const,
};

export async function fetchOrderDetailItems(
	orderId: string,
	options: BackendRouteOptions = {},
): Promise<OrderDetailItem[]> {
	const { orderItems } = await listOrderItemsByOrder({ orderId }, options);

	return Promise.all(
		orderItems.map(async (item) => {
			const baseItem = {
				id: item.id,
				note: item.note,
				productFillingId: item.productFillingId,
				productId: item.productId,
				productSizeId: item.productSizeId,
				quantity: item.quantity,
				total: item.total,
				unitPrice: item.unitPrice,
			};

			try {
				const { product } = await fetchProductById(
					{ productId: item.productId },
					options,
				);

				return { ...baseItem, productName: product.name };
			} catch {
				return {
					...baseItem,
					productName: `Produto ${item.productId.slice(0, 8)}…`,
				};
			}
		}),
	);
}

export function orderDetailItemsQueryOptions(orderId: string | null) {
	return queryOptions({
		enabled: Boolean(orderId),
		queryFn: ({ signal }) => fetchOrderDetailItems(orderId ?? "", { signal }),
		queryKey: profileOrderQueryKeys.items(orderId ?? "none"),
	});
}
