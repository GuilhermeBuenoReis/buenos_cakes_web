"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createAddress } from "@/api/backend/routes/create-address";
import { updateAddress } from "@/api/backend/routes/update-address";
import {
	type ProfileAddressFormValues,
	profileAddressSchema,
	toProfileAddressFormValues,
} from "../_lib/profile-address-form";
import type { ProfileAddress } from "../_lib/profile-content";

interface UseProfileAddressFormParams {
	address?: ProfileAddress;
	userId: string;
}

export function useProfileAddressForm({
	address,
	userId,
}: UseProfileAddressFormParams) {
	const router = useRouter();
	const [{ modal }, setParams] = useQueryStates({
		modal: parseAsString,
		addressId: parseAsString,
	});
	const [submitError, setSubmitError] = useState<string | null>(null);

	const isOpen = modal === "new-address" || modal === "edit-address";
	const isEditing = !!address;

	const form = useForm<ProfileAddressFormValues>({
		defaultValues: toProfileAddressFormValues(address),
		resolver: zodResolver(profileAddressSchema),
	});
	const {
		formState: { isSubmitting },
		reset,
	} = form;

	useEffect(() => {
		if (isOpen) {
			reset(toProfileAddressFormValues(address));
			setSubmitError(null);
		}
	}, [address, isOpen, reset]);

	function handleClose() {
		setParams({ modal: null, addressId: null });
		setSubmitError(null);
	}

	const onSubmit = form.handleSubmit(async (values) => {
		setSubmitError(null);

		const payload = {
			city: values.city,
			complement: values.complement || null,
			houseNumber: values.houseNumber,
			label: values.label,
			recipientName: values.recipientName,
			reference: values.reference || null,
			state: values.state,
			street: values.street,
			zipCode: values.zipCode,
		};

		try {
			if (isEditing) {
				await updateAddress({ addressId: address.id, ...payload });
			} else {
				await createAddress({ userId, isDefault: false, ...payload });
			}

			handleClose();
			router.refresh();
		} catch {
			setSubmitError("Ocorreu um erro ao salvar o endereço. Tente novamente.");
		}
	});

	return {
		form,
		handleClose,
		isEditing,
		isOpen,
		isSubmitting,
		onSubmit,
		submitError,
	};
}
