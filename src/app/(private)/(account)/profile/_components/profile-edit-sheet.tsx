"use client";

import type { ChangeEvent } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useProfileEditForm } from "../_hooks/use-profile-edit-form";
import type { ProfileCustomer } from "../_lib/profile-content";
import { ProfileSheetField } from "./profile-sheet-field";

interface ProfileEditSheetProps {
	customer: ProfileCustomer;
	userId: string;
}

export function ProfileEditSheet({ customer, userId }: ProfileEditSheetProps) {
	const {
		form: {
			control,
			formState: { errors },
			register,
		},
		handleClose,
		isOpen,
		isSubmitting,
		maskCpf,
		maskPhone,
		onSubmit,
		submitError,
	} = useProfileEditForm({ customer, userId });

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-md">
				<SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6">
					<SheetTitle className="text-xl font-black tracking-tight text-slate-950">
						Editar Perfil
					</SheetTitle>
					<SheetDescription className="text-sm text-slate-500">
						Atualize suas informações pessoais abaixo.
					</SheetDescription>
				</SheetHeader>

				<form
					onSubmit={onSubmit}
					noValidate
					className="flex flex-1 flex-col gap-5 px-6 py-6"
				>
					<ProfileSheetField
						error={errors.name?.message}
						htmlFor="edit-name"
						label="Nome completo"
					>
						<Input
							id="edit-name"
							variant="subtle"
							autoComplete="name"
							{...register("name")}
						/>
					</ProfileSheetField>

					<ProfileSheetField
						error={errors.email?.message}
						htmlFor="edit-email"
						label="E-mail"
					>
						<Input
							id="edit-email"
							type="email"
							variant="subtle"
							autoComplete="email"
							{...register("email")}
						/>
					</ProfileSheetField>

					<ProfileSheetField
						hint="Celular: (11) 99999-9999 · Fixo: (11) 9999-9999"
						htmlFor="edit-phone"
						label="Telefone"
					>
						<div className="relative">
							<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-sm font-semibold text-slate-400">
								+55
							</span>
							<Controller
								control={control}
								name="phone"
								render={({ field }) => {
									function handlePhoneChange(
										event: ChangeEvent<HTMLInputElement>,
									) {
										const masked = maskPhone(event.target.value);
										if (masked === null) {
											return;
										}

										field.onChange(masked);
									}

									return (
										<Input
											id="edit-phone"
											type="tel"
											variant="subtle"
											value={field.value}
											onChange={handlePhoneChange}
											onBlur={field.onBlur}
											placeholder="(11) 99999-9999"
											autoComplete="tel"
											className="pl-12"
											inputMode="numeric"
										/>
									);
								}}
							/>
						</div>
					</ProfileSheetField>

					<ProfileSheetField
						hint="CPF: 000.000.000-00 · CNPJ: 00.000.000/0000-00"
						htmlFor="edit-cpf"
						label="CPF / CNPJ"
					>
						<Controller
							control={control}
							name="cpf"
							render={({ field }) => {
								function handleCpfChange(event: ChangeEvent<HTMLInputElement>) {
									const masked = maskCpf(event.target.value);
									if (masked === null) {
										return;
									}

									field.onChange(masked);
								}

								return (
									<Input
										id="edit-cpf"
										variant="subtle"
										value={field.value}
										onChange={handleCpfChange}
										onBlur={field.onBlur}
										placeholder="000.000.000-00"
										inputMode="numeric"
									/>
								);
							}}
						/>
					</ProfileSheetField>

					{submitError && (
						<p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
							{submitError}
						</p>
					)}

					<SheetFooter className="mt-auto px-0 pb-0">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-12 w-full rounded-full bg-[#ff4b61] text-white shadow-[0_20px_36px_-24px_rgba(255,75,97,0.6)] hover:bg-rose-600 disabled:opacity-70"
						>
							{isSubmitting ? "Salvando..." : "Salvar alterações"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
