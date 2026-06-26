"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type AddOrderItemRequestInput,
	addOrderItem,
	type ChangeOrderItemRequestInput,
	changeOrderItem,
	type RemoveOrderItemRequestInput,
	removeOrderItem,
} from "@/api/backend/profile";
import { profileOrderQueryKeys } from "../_queries/order-details";

export type AddOrderItemVariables = Omit<AddOrderItemRequestInput, "orderId">;
export type ChangeOrderItemVariables = Omit<
	ChangeOrderItemRequestInput,
	"orderId"
>;
export type RemoveOrderItemVariables = Omit<
	RemoveOrderItemRequestInput,
	"orderId"
>;

function invalidateOrderQueries(
	queryClient: ReturnType<typeof useQueryClient>,
	orderId: string,
) {
	void queryClient.invalidateQueries({
		queryKey: profileOrderQueryKeys.detail(orderId),
	});
	void queryClient.invalidateQueries({
		queryKey: profileOrderQueryKeys.items(orderId),
	});
}

export function useAddOrderItemMutation(orderId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables: AddOrderItemVariables) =>
			addOrderItem({ ...variables, orderId }),
		onSuccess: () => invalidateOrderQueries(queryClient, orderId),
	});
}

export function useChangeOrderItemMutation(orderId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables: ChangeOrderItemVariables) =>
			changeOrderItem({ ...variables, orderId }),
		onSuccess: () => invalidateOrderQueries(queryClient, orderId),
	});
}

export function useRemoveOrderItemMutation(orderId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables: RemoveOrderItemVariables) =>
			removeOrderItem({ ...variables, orderId }),
		onSuccess: () => invalidateOrderQueries(queryClient, orderId),
	});
}
