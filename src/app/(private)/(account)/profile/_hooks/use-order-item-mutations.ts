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

export function useAddOrderItemMutation(orderId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables: AddOrderItemVariables) =>
			addOrderItem({ ...variables, orderId }),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: profileOrderQueryKeys.items(orderId),
			});
		},
	});
}

export function useChangeOrderItemMutation(orderId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables: ChangeOrderItemVariables) =>
			changeOrderItem({ ...variables, orderId }),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: profileOrderQueryKeys.items(orderId),
			});
		},
	});
}

export function useRemoveOrderItemMutation(orderId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables: RemoveOrderItemVariables) =>
			removeOrderItem({ ...variables, orderId }),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: profileOrderQueryKeys.items(orderId),
			});
		},
	});
}
