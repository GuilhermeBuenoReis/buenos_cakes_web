"use client";

import { useEffect, useState } from "react";
import { fetchProductById } from "@/api/backend/routes/fetch-product-by-id";
import { listOrderItemsByOrder } from "@/api/backend/routes/list-order-items-by-order";

export interface OrderDetailItem {
	id: string;
	note?: string | null;
	productName: string;
	quantity: number;
	total: number;
	unitPrice: number;
}

interface UseOrderDetailsParams {
	isOpen: boolean;
	orderId: string | null;
}

export function useOrderDetails({ isOpen, orderId }: UseOrderDetailsParams) {
	const [items, setItems] = useState<OrderDetailItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen || !orderId) {
			return;
		}

		let cancelled = false;
		setLoading(true);
		setError(null);
		setItems([]);

		async function fetchDetails(currentOrderId: string) {
			try {
				const { orderItems } = await listOrderItemsByOrder({
					orderId: currentOrderId,
				});

				if (cancelled) {
					return;
				}

				const enriched = await Promise.all(
					orderItems.map(async (item) => {
						try {
							const { product } = await fetchProductById({
								productId: item.productId,
							});

							return {
								id: item.id,
								note: item.note,
								productName: product.name,
								quantity: item.quantity,
								total: item.total,
								unitPrice: item.unitPrice,
							};
						} catch {
							return {
								id: item.id,
								note: item.note,
								productName: `Produto ${item.productId.slice(0, 8)}…`,
								quantity: item.quantity,
								total: item.total,
								unitPrice: item.unitPrice,
							};
						}
					}),
				);

				if (!cancelled) {
					setItems(enriched);
				}
			} catch {
				if (!cancelled) {
					setError("Não foi possível carregar os itens do pedido.");
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		fetchDetails(orderId);

		return () => {
			cancelled = true;
		};
	}, [isOpen, orderId]);

	return { error, items, loading };
}
