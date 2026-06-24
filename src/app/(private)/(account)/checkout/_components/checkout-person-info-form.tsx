"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type BaseSyntheticEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCheckoutCustomer } from "../_context/checkout-customer-context";
import {
	type CheckoutPersonalInfoValues,
	checkoutPersonalInfoSchema,
} from "../_lib/checkout-personal-info";
import { CheckoutPersonInfoField } from "./checkout-person-info-field";

export function CheckoutPersonalInfoForm() {
	const router = useRouter();

	const {
		customerInfo,
		registerSubmitCustomerInfo,
		setCustomerInfo,
		updateCustomerInfo,
	} = useCheckoutCustomer();

	const { control, handleSubmit } = useForm<CheckoutPersonalInfoValues>({
		defaultValues: customerInfo,
		mode: "onBlur",
		reValidateMode: "onChange",
		resolver: zodResolver(checkoutPersonalInfoSchema),
	});

	function handlePersonalInfoSubmit(values: CheckoutPersonalInfoValues) {
		setCustomerInfo(values);
		router.push("/checkout/payment");
	}

	function handleSubmitPersonalInfo(event?: BaseSyntheticEvent) {
		void handleSubmit(handlePersonalInfoSubmit)(event);
	}

	function handleFullNameChange(value: string) {
		updateCustomerInfo({ fullName: value });
	}

	function handleEmailChange(value: string) {
		updateCustomerInfo({ email: value });
	}

	function handlePhoneChange(value: string) {
		updateCustomerInfo({ phone: value });
	}

	useEffect(() => {
		function handleRegisteredPersonalInfoSubmit(
			values: CheckoutPersonalInfoValues,
		) {
			setCustomerInfo(values);
			router.push("/checkout/payment");
		}

		function handleRegisteredSubmit() {
			void handleSubmit(handleRegisteredPersonalInfoSubmit)();
		}

		registerSubmitCustomerInfo(handleRegisteredSubmit);

		return () => {
			registerSubmitCustomerInfo(null);
		};
	}, [handleSubmit, registerSubmitCustomerInfo, router, setCustomerInfo]);

	return (
		<form
			className="mt-6 grid gap-4 sm:grid-cols-2"
			noValidate
			onSubmit={handleSubmitPersonalInfo}
		>
			<CheckoutPersonInfoField
				autoComplete="name"
				className="space-y-2.5 sm:col-span-2"
				control={control}
				id="checkout-name"
				label="Nome Completo"
				name="fullName"
				onValueChange={handleFullNameChange}
				placeholder="Ex: Ana Silva"
			/>

			<CheckoutPersonInfoField
				autoComplete="email"
				className="space-y-2.5"
				control={control}
				id="checkout-email"
				label="E-mail"
				name="email"
				onValueChange={handleEmailChange}
				placeholder="ana.silva@exemplo.com"
				type="email"
			/>

			<CheckoutPersonInfoField
				autoComplete="tel"
				className="space-y-2.5"
				control={control}
				id="checkout-phone"
				label="WhatsApp / Telefone"
				name="phone"
				onValueChange={handlePhoneChange}
				placeholder="(11) 99999-9999"
				type="tel"
			/>
		</form>
	);
}
