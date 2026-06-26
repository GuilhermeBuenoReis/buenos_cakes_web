"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { buildOrderChangeCheckoutUrls } from "../_lib/order-change-checkout-urls";
import { getOrderChangeErrorMessage } from "../_lib/order-change-errors";
import type { OrderChangeFeedback } from "../_lib/order-change-feedback";
import { buildOrderChangeFeedback } from "../_lib/order-change-feedback";
import {
	fromOrderItemOptionId,
	type OrderItemFormValues,
	orderItemFormSchema,
	toOrderItemOptionId,
} from "../_lib/order-item-form";
import type { OrderDetailItem } from "../_queries/order-details";
import {
	activeProductsQueryOptions,
	productFillingsQueryOptions,
	productSizesQueryOptions,
} from "../_queries/order-item-catalog";
import {
	useAddOrderItemMutation,
	useChangeOrderItemMutation,
} from "./use-order-item-mutations";

interface UseOrderItemFormParams {
	customerEmail: string | null;
	item?: OrderDetailItem;
	mode: "add" | "edit";
	onApplied: () => void;
	onResult: (feedback: OrderChangeFeedback) => void;
	orderId: string;
}

export function useOrderItemForm({
	customerEmail,
	item,
	mode,
	onApplied,
	onResult,
	orderId,
}: UseOrderItemFormParams) {
	const router = useRouter();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm<OrderItemFormValues>({
		defaultValues: {
			note: item?.note ?? "",
			productFillingId: fromOrderItemOptionId(item?.productFillingId),
			productId: item?.productId ?? "",
			productSizeId: fromOrderItemOptionId(item?.productSizeId),
			quantity: item?.quantity ?? 1,
		},
		resolver: zodResolver(orderItemFormSchema),
	});

	const selectedProductId = form.watch("productId") || null;

	const productsQuery = useQuery(activeProductsQueryOptions());
	const sizesQuery = useQuery(productSizesQueryOptions(selectedProductId));
	const fillingsQuery = useQuery(
		productFillingsQueryOptions(selectedProductId),
	);

	useEffect(() => {
		if (mode !== "add" || !selectedProductId) {
			return;
		}

		form.resetField("productSizeId");
		form.resetField("productFillingId");
	}, [form, mode, selectedProductId]);

	const addMutation = useAddOrderItemMutation(orderId);
	const changeMutation = useChangeOrderItemMutation(orderId);
	const isSubmitting = addMutation.isPending || changeMutation.isPending;

	const onSubmit = form.handleSubmit(async (values) => {
		setSubmitError(null);

		const checkoutUrls = buildOrderChangeCheckoutUrls(orderId);
		const payload = {
			...checkoutUrls,
			customerEmail: customerEmail ?? null,
			note: values.note ? values.note : null,
			productFillingId: toOrderItemOptionId(values.productFillingId),
			productId: values.productId,
			productSizeId: toOrderItemOptionId(values.productSizeId),
			quantity: values.quantity,
		};

		try {
			const response =
				mode === "edit" && item
					? await changeMutation.mutateAsync({
							...payload,
							orderItemId: item.id,
						})
					: await addMutation.mutateAsync(payload);

			router.refresh();

			const feedback = buildOrderChangeFeedback(response.change);
			onResult(feedback);

			if (feedback.isApplied) {
				onApplied();
			}
		} catch (error) {
			setSubmitError(getOrderChangeErrorMessage(error));
		}
	});

	return {
		fillings: fillingsQuery.data?.productFillings ?? [],
		form,
		isLoadingFillings: fillingsQuery.isFetching,
		isLoadingProducts: productsQuery.isLoading,
		isLoadingSizes: sizesQuery.isFetching,
		isSubmitting,
		onSubmit,
		products: productsQuery.data?.products ?? [],
		selectedProductId,
		sizes: sizesQuery.data?.productSizes ?? [],
		submitError,
	};
}
