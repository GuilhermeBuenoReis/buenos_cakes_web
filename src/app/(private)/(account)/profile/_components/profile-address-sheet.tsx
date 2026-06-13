"use client";

import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { createAddress } from "@/api/backend/routes/create-address";
import { updateAddress } from "@/api/backend/routes/update-address";
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
import type { ProfileAddress } from "../_lib/profile-content";

interface ProfileAddressSheetProps {
	address?: ProfileAddress;
	userId: string;
}

export function ProfileAddressSheet({ address, userId }: ProfileAddressSheetProps) {
	const router = useRouter();
	const [{ modal }, setParams] = useQueryStates({
		modal: parseAsString,
		addressId: parseAsString,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isOpen = modal === "new-address" || modal === "edit-address";
	const isEditing = !!address;

	function handleClose() {
		setParams({ modal: null, addressId: null });
		setError(null);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const fd = new FormData(event.currentTarget);
		const get = (key: string) => (fd.get(key) as string).trim();

		try {
			if (isEditing) {
				await updateAddress({
					addressId: address.id,
					label: get("label"),
					recipientName: get("recipientName"),
					street: get("street"),
					houseNumber: get("houseNumber"),
					complement: get("complement") || null,
					city: get("city"),
					state: get("state"),
					zipCode: get("zipCode"),
					reference: get("reference") || null,
				});
			} else {
				await createAddress({
					userId,
					label: get("label"),
					recipientName: get("recipientName"),
					street: get("street"),
					houseNumber: get("houseNumber"),
					complement: get("complement") || null,
					city: get("city"),
					state: get("state"),
					zipCode: get("zipCode"),
					reference: get("reference") || null,
					isDefault: false,
				});
			}

			handleClose();
			router.refresh();
		} catch {
			setError("Ocorreu um erro ao salvar o endereço. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Sheet open={isOpen} onOpenChange={(v) => !v && handleClose()}>
			<SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-md">
				<SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6">
					<SheetTitle className="text-xl font-black tracking-tight text-slate-950">
						{isEditing ? "Editar endereço" : "Novo endereço"}
					</SheetTitle>
					<SheetDescription className="text-sm text-slate-500">
						{isEditing
							? "Atualize os dados do endereço abaixo."
							: "Preencha os dados do novo endereço."}
					</SheetDescription>
				</SheetHeader>

				<form
					onSubmit={handleSubmit}
					className="flex flex-1 flex-col gap-5 px-6 py-6"
				>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2 space-y-1.5">
							<label
								htmlFor="addr-label"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Nome do endereço
							</label>
							<Input
								id="addr-label"
								name="label"
								variant="subtle"
								defaultValue={address?.label}
								placeholder="Casa, Trabalho…"
								required
							/>
						</div>

						<div className="col-span-2 space-y-1.5">
							<label
								htmlFor="addr-recipient"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Destinatário
							</label>
							<Input
								id="addr-recipient"
								name="recipientName"
								variant="subtle"
								defaultValue={address?.recipientName}
								placeholder="Nome de quem receberá"
								required
								autoComplete="name"
							/>
						</div>

						<div className="col-span-2 space-y-1.5">
							<label
								htmlFor="addr-street"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Rua / Avenida
							</label>
							<Input
								id="addr-street"
								name="street"
								variant="subtle"
								defaultValue={address?.street}
								placeholder="Rua das Flores"
								required
								autoComplete="street-address"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="addr-number"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Número
							</label>
							<Input
								id="addr-number"
								name="houseNumber"
								variant="subtle"
								defaultValue={address?.houseNumber}
								placeholder="123"
								required
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="addr-complement"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Complemento
							</label>
							<Input
								id="addr-complement"
								name="complement"
								variant="subtle"
								defaultValue={address?.complement ?? ""}
								placeholder="Apto, Bloco…"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="addr-city"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Cidade
							</label>
							<Input
								id="addr-city"
								name="city"
								variant="subtle"
								defaultValue={address?.city}
								placeholder="São Paulo"
								required
								autoComplete="address-level2"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="addr-state"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Estado
							</label>
							<Input
								id="addr-state"
								name="state"
								variant="subtle"
								defaultValue={address?.state}
								placeholder="SP"
								maxLength={2}
								required
								autoComplete="address-level1"
								className="uppercase"
							/>
						</div>

						<div className="col-span-2 space-y-1.5">
							<label
								htmlFor="addr-zip"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								CEP
							</label>
							<Input
								id="addr-zip"
								name="zipCode"
								variant="subtle"
								defaultValue={address?.zipCode}
								placeholder="00000-000"
								required
								autoComplete="postal-code"
								inputMode="numeric"
							/>
						</div>

						<div className="col-span-2 space-y-1.5">
							<label
								htmlFor="addr-reference"
								className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
							>
								Referência
							</label>
							<Input
								id="addr-reference"
								name="reference"
								variant="subtle"
								defaultValue={address?.reference ?? ""}
								placeholder="Portão azul, próximo ao mercado…"
							/>
						</div>
					</div>

					{error && (
						<p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
							{error}
						</p>
					)}

					<SheetFooter className="mt-auto px-0 pb-0">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-12 w-full rounded-full bg-[#ff4b61] text-white shadow-[0_20px_36px_-24px_rgba(255,75,97,0.6)] hover:bg-rose-600 disabled:opacity-70"
						>
							{isSubmitting
								? "Salvando..."
								: isEditing
									? "Salvar alterações"
									: "Adicionar endereço"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
