"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
	type OrderDetailItem,
	orderDetailItemsQueryOptions,
	profileOrderQueryKeys,
} from "../_queries/order-details";

export type { OrderDetailItem };

interface UseOrderDetailsParams {
	isOpen: boolean;
	orderId: string | null;
}

export function useOrderDetails({ isOpen, orderId }: UseOrderDetailsParams) {
	const queryClient = useQueryClient();
	const query = useQuery({
		...orderDetailItemsQueryOptions(orderId),
		enabled: isOpen && Boolean(orderId),
	});

	const reload = useCallback(() => {
		if (!orderId) {
			return;
		}

		void queryClient.invalidateQueries({
			queryKey: profileOrderQueryKeys.items(orderId),
		});
	}, [orderId, queryClient]);

	return {
		error: query.isError
			? "Não foi possível carregar os itens do pedido."
			: null,
		items: query.data ?? [],
		loading: query.isLoading,
		reload,
	};
}
