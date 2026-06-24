"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "@/api/backend/routes/update-user";
import { formatCpfCnpj, formatPhone, stripMask } from "@/lib/format-document";
import type { ProfileCustomer } from "../_lib/profile-content";
import {
	type ProfileEditFormValues,
	profileEditSchema,
	toProfileEditFormValues,
} from "../_lib/profile-edit-form";

interface UseProfileEditFormParams {
	customer: ProfileCustomer;
	userId: string;
}

export function useProfileEditForm({
	customer,
	userId,
}: UseProfileEditFormParams) {
	const router = useRouter();
	const [modal, setModal] = useQueryState("modal", parseAsString);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const isOpen = modal === "edit-profile";

	const form = useForm<ProfileEditFormValues>({
		defaultValues: toProfileEditFormValues(customer),
		resolver: zodResolver(profileEditSchema),
	});
	const {
		formState: { isSubmitting },
		reset,
	} = form;

	useEffect(() => {
		if (isOpen) {
			reset(toProfileEditFormValues(customer));
			setSubmitError(null);
		}
	}, [customer, isOpen, reset]);

	function maskPhone(value: string) {
		const digits = stripMask(value);
		if (digits.length > 11) {
			return null;
		}

		return digits ? formatPhone(digits) : "";
	}

	function maskCpf(value: string) {
		const digits = stripMask(value);
		if (digits.length > 14) {
			return null;
		}

		return digits ? formatCpfCnpj(digits) : "";
	}

	function handleClose() {
		setModal(null);
	}

	const onSubmit = form.handleSubmit(async (values) => {
		setSubmitError(null);

		try {
			await updateUser({
				userId,
				name: values.name.trim(),
				email: values.email.trim(),
				cpf: stripMask(values.cpf) || null,
				phone: stripMask(values.phone) || null,
			});
			handleClose();
			router.refresh();
		} catch {
			setSubmitError("Ocorreu um erro ao atualizar o perfil. Tente novamente.");
		}
	});

	return {
		form,
		handleClose,
		isOpen,
		isSubmitting,
		maskCpf,
		maskPhone,
		onSubmit,
		submitError,
	};
}
